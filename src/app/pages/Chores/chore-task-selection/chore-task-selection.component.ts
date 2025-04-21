import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChoreCategoryService } from '../../../services/chores/chore-category.service';
import { Category, Task } from '../../../interfaces/categories';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { AuthService } from '../../../services/auth/auth.service';
import { collection, collectionData, doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { user } from '@angular/fire/auth';

/*
This component is responsible for selecting a chore task based on the selected category.
It will also be displayed on a card.
Upon selecting a task, the chore-list array is updated with the selected task.
So we need to push the selected task to the chore-list array, which will be displayed on the Chore-List Homepage component.
*/

@Component({
	selector: 'app-chore-task-selection',
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: './chore-task-selection.component.html',
	styleUrl: './chore-task-selection.component.scss',
})
export class ChoreTaskSelectionComponent implements OnInit {
	// Variable to store the task from a specific category
	public tasks?: Task[] | undefined;
	public selectedCategory?: Category | undefined;

	// public taskGroup = new FormGroup({
	// 	tasks: new FormArray<any>([]),
	// });

	public famillyGroupName: string = '';
	public uid?: string | null;

	/*
  First we need to inject the ActivatedRoute to get the categoryId from the URL.
  Then we can use this categoryId to get the tasks of that category.
  */
	constructor(
		private readonly _activeRoute: ActivatedRoute,
		private readonly _choreCatService: ChoreCategoryService,
		private readonly _taskSelectionService: TaskSelectionService,
		private readonly _authService: AuthService,
		private readonly _firestore: Firestore,
	) {}

	async ngOnInit() {
		this.getTasks();
		this.getCategory();
	}

	// This method takes first the categoryId from the URL, then if the categoryId is not null, we can get the categories from the service.
	// Then we can find the selected category by comparing the uuid of the category with the categoryId from the URL.
	// Finally we can assign the tasks of the selected category to the tasks variable.
	// We display it on the HTML page using a loop @for
	async getTasks() {
		const categoryId: string | null = this._activeRoute.snapshot.paramMap.get('categoryId');
		if (categoryId) {
			this.tasks = await this._choreCatService.getTasksByCategoryId(categoryId);
		}
	}

	async getCategory() {
		const categoryId: string | null = this._activeRoute.snapshot.paramMap.get('categoryId');
		if (categoryId) {
			this.selectedCategory = await this._choreCatService.getCategoryById(categoryId);
		}
	}

	/*
	We want to add every task the user clicks on to the Firestore Task subcollection of the Familly group the user is linked to.
	
	1) We need to know who is the current user.
	2) We need to get the Familly group collection the user is linked to.
	3) We need to point to the Tasks subcollection of the Familly group document
	4) Every time the user clicks on a task, we add the task as new document in the Tasks subcollection.

	*/

	async addTask(task: Task) {
		//We need to search for the uid field of the Users collection of a specific user.
		//If we have more than one user, we need to get the uid of the user that is currently logged in.
		const userId = this._authService.getUserId();
		console.log('userId:', userId);

		//We create a variale to store the id of the document of the Familly group the user is linked to.
		let linkedFamilyDocId: string | null = null;

		// We point to the collection Users
		// We query the documents from the Users collections with the filter uid == userId
		// We execute the query and get the matching documents
		// For each documents we assign the field uid of the document to the uid variable.
		const userColRef = collection(this._firestore, 'Users');
		const userQuery = query(userColRef, where('uid', '==', userId));
		const querySnapshot = await getDocs(userQuery);
		querySnapshot.forEach(doc => {
			this.uid = doc.get('uid');
			console.log(this.uid);
		});

		// Now we want to get the Familly group document where the user is linked to.
		// We point to the 'Familly' collection.
		// We query the documents from the 'Familly' collection where we look for the userId in the members array.
		// We execute the query.
		const famillyColRef = collection(this._firestore, 'Familly');
		const famillyQuery = query(famillyColRef, where('members', 'array-contains', userId));
		const famillyQuerySnapshot = await getDocs(famillyQuery);

		// We loop through all docs from the QuerySnapshot.
		// We assign the id of the document to the famillyDocId variable.
		// We assign the data of the document to the famillyData variable.
		for (const famillyDoc of famillyQuerySnapshot.docs) {
			const famillyDocId = famillyDoc.id;
			const famillyData = famillyDoc.data();

			// We create a members variable which is the members array of the document.
			// We check if the index of the array includes the userId.
			// If it does, we connect the variable linkedFamilyDocId to the famillyDocId.
			// We break the loop.
			const members = famillyData['members'] || [];
			if (members.includes(userId)) {
				linkedFamilyDocId = famillyDocId;
				break;
			}
		}

		// If linkedFamillyDocId isn't null, we call the addTask method from the TaskSelectionService
		// which add the selected task to Firestore in the Tasks subcollection of the Familly group document.
		if (linkedFamilyDocId) {
			console.log('User is linked to Familly group:', linkedFamilyDocId);
			await this._taskSelectionService.addTask(linkedFamilyDocId, task);
		}
	}
}
