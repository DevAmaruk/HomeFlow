import { Injectable } from '@angular/core';
import { Task } from '../../interfaces/categories';
import { addDoc, collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { FamillyService } from '../famillyService/familly.service';

/*
This service is responsible for handling the addition of tasks to the familly group.
It retrieves the tasks from the Tasks subcollection of the familly group to be displayed in the homepage.
*/

@Injectable({
	providedIn: 'root',
})
export class TaskSelectionService {
	public _taskDescription$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

	public taskDescription$: Observable<string[]> = this._taskDescription$.asObservable();

	constructor(private readonly _firestore: Firestore, private readonly _famillyService: FamillyService) {}

	//This method is used to add a task to the familly group.
	public async addTask(task: Task) {
		// Get the familly group name from the FamillyService
		const famillyGroupName = await this._famillyService.getFamillyGroupName();
		console.log('Familly group name:', famillyGroupName);

		// Check if the familly group name is set
		if (!famillyGroupName) {
			throw new Error('Familly group name is not set. Please set it before adding tasks.');
		}

		try {
			// Create a reference to the Tasks subcollection of the familly group
			const taskColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
			// Add the task to the Tasks subcollection
			await addDoc(taskColRef, task);
			console.log('Task added successfully:', task);
		} catch (error) {
			console.error('Error adding task:', error);
			throw new Error('Failed to add task. Please try again later.');
		}
	}

	//This method is used to get the tasks from the familly group.
	public async getTasksFromFamillyGroup(): Promise<string[]> {
		const famillyGroupName = await this._famillyService.getFamillyGroupName();
		console.log('Familly group name:', famillyGroupName);

		if (!famillyGroupName) {
			throw new Error('Familly group name is not set. Please set it before getting tasks.');
		}

		try {
			const taskColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
			const taskQuery = query(taskColRef, where('uuid', '!=', null));
			const taskSnapshot = await getDocs(taskQuery);

			const taskDescriptions: string[] = taskSnapshot.docs.map(doc => doc.get('description'));
			this._taskDescription$.next(taskDescriptions);
			console.log('Tasks fetched successfully:', taskDescriptions);
			return taskDescriptions;
		} catch (error) {
			console.error('Error fetching tasks:', error);
			throw new Error('Failed to fetch tasks. Please try again later.');
		}
	}

	// async getTasksForFamilly(famillyGroupName: string) {
	// 	const tasksColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
	// 	const taskQuery = query(tasksColRef, where('uuid', '!=', null));
	// 	const taskSnapshot = await getDocs(taskQuery);

	// 	const taskDescriptions: string[] = taskSnapshot.docs.map(doc => doc.get('description'));
	// 	this._taskDescription$.next(taskDescriptions);
	// }
}
