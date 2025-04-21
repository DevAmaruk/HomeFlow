import { Injectable } from '@angular/core';
import { Task } from '../../interfaces/categories';
import { addDoc, collection, collectionData, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/*
This service will create a FormArray with the tasks selected by the user.
It will be injected in the homepage.
*/

@Injectable({
	providedIn: 'root',
})
export class TaskSelectionService {
	public selectedTasks: Task[] = [];

	public _taskDescription$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

	public taskDescription$: Observable<string[]> = this._taskDescription$.asObservable();

	// private famillyGroupCollectionName?: string;

	constructor(private readonly _firestore: Firestore, private readonly _authService: AuthService) {
		// this.getTaskDescription();
		this.getTasksForFamilly('Ma Famille 2');
	}

	async addTask(famillyGroupName: string, task: Task) {
		if (!famillyGroupName) {
			throw new Error('Familly group name is not set. Please set it before adding tasks.');
		}

		try {
			const tasksColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
			await addDoc(tasksColRef, task);
			console.log('Task added successfully:', task);
		} catch (error) {
			console.error('Error adding task:', error);
			throw new Error('Failed to add task. Please try again later.');
		}
	}

	async getTasksForFamilly(famillyGroupName: string) {
		const tasksColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
		const taskQuery = query(tasksColRef, where('uuid', '!=', null));
		const taskSnapshot = await getDocs(taskQuery);

		const taskDescriptions: string[] = taskSnapshot.docs.map(doc => doc.get('description'));
		this._taskDescription$.next(taskDescriptions);
	}

	// async getTaskDescription() {
	// 	//We need to get the correct familly group name based on the current user logged in.
	// 	const userId = this._authService.getUserId();

	// 	const famillyColRef = collection(this._firestore, 'Familly');
	// 	const famillyQuery = query(famillyColRef, where('members', 'array-contains', userId));
	// 	const famillySnapshot = await getDocs(famillyQuery);
	// }

	// async addTask(task: Task) {
	// 	if (!this.famillyGroupCollectionName) {
	// 		throw new Error('Familly group collection name is not set. Please set it before adding tasks.');
	// 	}
	// 	const tasksCollectionRef = collection(this._firestore, this.famillyGroupCollectionName);
	// 	await addDoc(tasksCollectionRef, task);
	// }

	// async getTasksDescription() {
	// 	if (this.famillyGroupCollectionName) {
	// 		const tasksCollectionRef = collection(this._firestore, this.famillyGroupCollectionName);
	// 		const q = query(tasksCollectionRef);
	// 		this.taskDescription$ = collectionData(q).pipe(map((tasks: any[]) => tasks.map(task => task.description)));
	// 	}
	// }
}
