import { Injectable } from '@angular/core';
import {
	arrayRemove,
	arrayUnion,
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	Firestore,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
	writeBatch,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { User } from '@angular/fire/auth';
import { firstValueFrom, Observable, tap } from 'rxjs';

/*
This service will handle the logic with Firestore and the creation of a familly group
 */

@Injectable({
	providedIn: 'root',
})
export class FamillyService {
	//Variable for the name of the familly group
	public famillyGroupName: string | null = null;

	//Variable for the userId of the user currently connected.
	public user: User | null = null;

	//Observable for the userId of the user currently connected.
	public userObs: Observable<User | null>;

	constructor(
		private readonly _firestore: Firestore,
		private readonly _authService: AuthService,
	) {
		this.userObs = this._authService.user$;
	}

	public async addDefaultTask(tasksColRef: CollectionReference) {
		const defaultTaskDocRef = doc(tasksColRef);
		await setDoc(defaultTaskDocRef, {
			createdAt: new Date(), // Set the creation date of the task
		});
	}

	private async clearTasksSubcollection(
		tasksColRef: CollectionReference,
		batch: any,
	) {
		const tasksSnapshot = await getDocs(tasksColRef);
		tasksSnapshot.docs.forEach(doc => {
			batch.delete(doc.ref); // Delete each task document in the sub-collection
		});
	}

	//Method to get the current familly group name the user is logged in to.
	public async getFamillyGroupName(): Promise<string | null> {
		// We convert the Observable to a Promise to get the current user
		this.user = await firstValueFrom(this.userObs);

		if (!this.user) {
			throw new Error('User does not exist.');
		}

		const famillyColRef = collection(this._firestore, 'Familly');
		const famillyQuery = query(
			famillyColRef,
			where('members', 'array-contains', this.user.uid),
		);
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		if (famillyQuerySnapshot.empty) {
			console.log('No familly group found for the current user.');
			return null;
		}

		const famillyGroupId = famillyQuerySnapshot.docs[0].id; // Get the document ID of the familly group
		console.log('Familly group name: ', famillyGroupId);
		return famillyGroupId;
	}

	// Method to add a member to the familly group.
	public async addMemberToFamillyGroup(memberEmail: string) {
		this.famillyGroupName = await this.getFamillyGroupName();

		if (!this.famillyGroupName) {
			throw new Error('Current familly group name could not be retrieved.');
		}

		//We look in the Users collection for the an email that matches the one we received in parameter.
		const usersColRef = collection(this._firestore, 'Users');
		const usersQuery = query(usersColRef, where('email', '==', memberEmail));
		const usersQuerySnapshot = await getDocs(usersQuery);

		if (usersQuerySnapshot.empty) {
			throw new Error('User with the provided email does not exist.');
		}

		const memberId = usersQuerySnapshot.docs[0].get('uid'); // Get the document ID of the user with the provided email
		console.log('Member ID:', memberId);

		const famillyDocRef = doc(
			this._firestore,
			'Familly',
			this.famillyGroupName,
		);

		// We update the document to add the new member to the members array
		await updateDoc(famillyDocRef, { members: arrayUnion(memberId) });

		const famillyColRef = collection(this._firestore, 'Familly');
		const addedMemberQuery = query(
			famillyColRef,
			where('members', 'array-contains', memberId),
		);
		const addedMemberQuerySnapshot = await getDocs(addedMemberQuery);

		const batch = writeBatch(this._firestore);

		for (const doc of addedMemberQuerySnapshot.docs) {
			if (doc.id !== this.famillyGroupName) {
				batch.update(doc.ref, { members: arrayRemove(memberId) }); // Remove the member from the members array of the other familly groups

				const remainingMembers = doc.get('members') as string[];
				if (remainingMembers.length > 1) {
					console.log(
						`Skipping task deletion for familly group ${doc.id} as it still has other members.`,
					);
					continue;
				}

				const taskColRef = collection(doc.ref, 'Tasks');
				this.clearTasksSubcollection(taskColRef, batch);
			}
		}

		await batch.commit();

		console.log('Batch operations committed successfully.');
	}

	// Method to create a familly group based on the input value from the user.
	public async createFamillyGroup(famillyInputName: string) {
		// We convert the Observable to a Promise to get the current user
		this.user = await firstValueFrom(this.userObs);

		if (!this.user) {
			throw new Error('User does not exist.');
		}

		const famillyColRef = collection(this._firestore, 'Familly');
		const famillyQuery = query(
			famillyColRef,
			where('name', '==', famillyInputName),
			where('members', 'array-contains', this.user.uid),
		);
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		if (!famillyQuerySnapshot.empty) {
			throw new Error(
				'A family group with this name already exists. Please choose a different name.',
			);
		}

		const famillyDocRef = doc(famillyColRef);
		await setDoc(famillyDocRef, {
			name: famillyInputName,
			members: [this.user.uid],
			createdAt: new Date(),
		});

		console.log(`Family group '${famillyInputName}' created successfully.`);

		const tasksColRef = collection(famillyDocRef, 'Tasks');
		await this.addDefaultTask(tasksColRef);

		const userDatabaseRef = collection(famillyDocRef, 'UserDatabase');
		await this.addDefaultTask(userDatabaseRef);

		const customCategoriesRef = collection(famillyDocRef, 'Categories');
		await this.addDefaultTask(customCategoriesRef);

		console.log('Default task added to the new family group.');
	}
}
