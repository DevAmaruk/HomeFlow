import { Injectable } from '@angular/core';
import { arrayUnion, collection, doc, Firestore, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

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
	public userId: string | undefined;

	//Variable for the document id of the familly group.
	public famillyGroupDocId: string | undefined;

	constructor(private readonly _firestore: Firestore, private readonly _authService: AuthService) {
		this.userId = this._authService.getUserId(); // Get the userId of the current user
	}

	// Method to add a member to the familly group.
	public async addMemberToFamillyGroup(memberId: string) {
		// We create a ref to the 'Familly' collection in Firestore
		const famillyColRef = collection(this._firestore, 'Familly');
		// We query the documents in the collection to find the one with the same name as the familly group
		const famillyQuery = query(famillyColRef, where('name', '==', this.famillyGroupName));
		// We execute the query
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		famillyQuerySnapshot.forEach(doc => {
			this.famillyGroupDocId = doc.id; // Get the document id of the familly group
		});

		// We create a ref to the familly group document using the document id
		const famillyDocRef = doc(this._firestore, 'Familly', this.famillyGroupDocId!);
		console.log('Familly doc ref:', famillyDocRef.id);
		// We update the document to add the new member to the members array
		await updateDoc(famillyDocRef, { members: arrayUnion(memberId) });
	}

	// Method to create a familly group based on the input value from the user.
	public async createFamillyGroup(famillyInputName: string) {
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
