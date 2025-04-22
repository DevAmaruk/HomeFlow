import { Injectable } from '@angular/core';
import { arrayUnion, collection, doc, Firestore, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { User } from '@angular/fire/auth';

/*
This service will handle the logic with Firestore and the creation of a familly group
 */

@Injectable({
	providedIn: 'root',
})
export class FamillyService {
	//Variable for the name of the familly group
	public famillyGroupName: string | undefined;

	//Variable for the userId of the user currently connected.
	public userId?: string | null;
	public user?: User | null;

	//Variable for the document id of the familly group.
	public famillyGroupDocId: string | undefined;

	constructor(private readonly _firestore: Firestore, private readonly _authService: AuthService) {
		console.log(this.getFamillyGroupName); // Get the userId of the current user
	}

	//Method to get the current familly group name the user is logged in to.
	public async getFamillyGroupName(): Promise<string | null> {
		this.user = this._authService.getCurrentUser();
		if (!this.user) {
			throw new Error('User does not exist.');
		}
		this.userId = this.user.uid;
		if (!this.userId) {
			throw new Error('User is not logged in.');
		}

		console.log('Current userId:', this.userId);

		const famillyColRef = collection(this._firestore, 'Familly');
		const famillyQuery = query(famillyColRef, where('members', 'array-contains', this.userId));
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		for (const doc of famillyQuerySnapshot.docs) {
			const famillyData = doc.data();
			return famillyData['name'] || null;
		}

		return null;
	}

	// Method to add a member to the familly group.
	public async addMemberToFamillyGroup(memberEmail: string) {
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

		// We create a ref to the 'Familly' collection in Firestore
		const famillyColRef = collection(this._firestore, 'Familly');
		// We query the documents in the collection to find the one with the same name as the familly group
		const famillyQuery = query(famillyColRef, where('name', '==', this.famillyGroupName));
		// We execute the query
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		famillyQuerySnapshot.forEach(doc => {
			this.famillyGroupDocId = doc.id; // Get the document id of the familly group
		});

		if (!this.famillyGroupDocId) {
			throw new Error('Familly group not found.');
		}

		// We create a ref to the familly group document using the document id
		const famillyDocRef = doc(this._firestore, 'Familly', this.famillyGroupDocId!);
		console.log('Familly doc ref:', famillyDocRef.id);
		// We update the document to add the new member to the members array
		await updateDoc(famillyDocRef, { members: arrayUnion(memberId) });

		// We know that memberId is obviously connected to the email of the user we want to add to the familly group.
		// We already have the ref to the Familly collection but we're querying the document of the current user not the one we are adding.
		// We need to get the document of the user we are adding so we can delete his document from the firestore.
	}

	// Method to create a familly group based on the input value from the user.
	public async createFamillyGroup(famillyInputName: string) {
		this.user = this._authService.getCurrentUser(); // Get the current user
		this.famillyGroupName = famillyInputName; // Set the familly group name to the input value

		// We create a reference to the 'Familly' collection in Firestore
		const famillyDocRef = doc(this._firestore, 'Familly', this.famillyGroupName);
		// We set the document with the familly group name and the userId as a member of the group
		await setDoc(famillyDocRef, { name: this.famillyGroupName, members: [this.userId] });

		// We create a reference to the 'Tasks' sub-collection within the familly group document
		const tasksColRef = collection(famillyDocRef, 'Tasks');
		const tasksDocRef = doc(tasksColRef);
		await setDoc(tasksDocRef, {
			createdAt: new Date(), // Set the creation date of the task
		});
	}
}
