import { Injectable } from '@angular/core';
import {
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
	public user?: User | null;

	//Variable for the document id of the familly group.
	public famillyGroupDocId: string | undefined;

	public userObs: Observable<User | null>;

	constructor(private readonly _firestore: Firestore, private readonly _authService: AuthService) {
		this.userObs = this._authService.user$;

		// const storedGroupName = localStorage.getItem('famillyGroupName');
		// if (storedGroupName) {
		// 	this.famillyGroupName = storedGroupName;
		// }
	}

	// public setFamillyGroupName(groupName: string) {
	// 	this.famillyGroupName = groupName;
	// 	localStorage.setItem('famillyGroupName', groupName); // Save to local storage
	// }

	// public clearFamillyGroupName(): void {
	// 	this.famillyGroupName = null;
	// 	localStorage.removeItem('famillyGroupName'); // Remove from local storage
	// }

	public async addDefaultTask(tasksColRef: CollectionReference) {
		const defaultTaskDocRef = doc(tasksColRef);
		await setDoc(defaultTaskDocRef, {
			createdAt: new Date(), // Set the creation date of the task
		});
	}

	public async clearTasksSubcollection(tasksColRef: CollectionReference) {
		const tasksSnapshot = await getDocs(tasksColRef);
		for (const taskDoc of tasksSnapshot.docs) {
			await deleteDoc(taskDoc.ref);
		}
	}

	//Method to get the current familly group name the user is logged in to.
	public async getFamillyGroupName(): Promise<string | null> {
		// We convert the Observable to a Promise to get the current user
		this.user = await firstValueFrom(this.userObs);

		if (!this.user) {
			throw new Error('User does not exist.');
		}

		if (this.famillyGroupName) {
			return this.famillyGroupName;
		}

		const famillyColRef = collection(this._firestore, 'Familly');
		const famillyQuery = query(famillyColRef, where('members', 'array-contains', this.user.uid));
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		for (const doc of famillyQuerySnapshot.docs) {
			this.famillyGroupDocId = doc.id; // Set the familly group name to the document id
			return this.famillyGroupDocId;
		}

		return null;
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

		let memberId: string | undefined;

		usersQuerySnapshot.forEach(doc => {
			memberId = doc.get('uid');
		});

		console.log('Member ID:', memberId);

		if (!memberId) {
			throw new Error('User with the provided email does not exist.');
		}

		const famillyColRef = collection(this._firestore, 'Familly');
		const famillyDocRef = doc(this._firestore, 'Familly', this.famillyGroupName);

		// We update the document to add the new member to the members array
		await updateDoc(famillyDocRef, { members: arrayUnion(memberId) });

		const addedMemberQuery = query(famillyColRef, where('members', 'array-contains', memberId));
		const addedMemberQuerySnapshot = await getDocs(addedMemberQuery);

		for (const doc of addedMemberQuerySnapshot.docs) {
			if (doc.id !== this.famillyGroupName) {
				await updateDoc(doc.ref, { members: [] });

				const taskColRef = collection(doc.ref, 'Tasks');
				await this.clearTasksSubcollection(taskColRef);
			}
		}
	}

	// Method to create a familly group based on the input value from the user.
	public async createFamillyGroup(famillyInputName: string) {
		// We convert the Observable to a Promise to get the current user
		this.user = await firstValueFrom(this.userObs);

		if (!this.user) {
			throw new Error('User does not exist.');
		}

		this.famillyGroupName = famillyInputName; // Set the familly group name to the input value

		// We create a reference to the 'Familly' collection in Firestore
		const famillyDocRef = doc(collection(this._firestore, 'Familly'));

		const famillyColRef = collection(this._firestore, 'Familly');
		const famillyQuery = query(
			famillyColRef,
			where('name', '==', this.famillyGroupName),
			where('members', 'array-contains', this.user.uid),
		);
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		if (!famillyQuerySnapshot.empty) {
			throw new Error('You already have a family group with this name. Please choose a different name.');
		}

		// We set the document with the familly group name and the userId as a member of the group
		await setDoc(famillyDocRef, { name: this.famillyGroupName, members: [this.user.uid] });

		// We create a reference to the 'Tasks' sub-collection within the familly group document
		const tasksColRef = collection(famillyDocRef, 'Tasks');
		await this.addDefaultTask(tasksColRef);
	}
}
