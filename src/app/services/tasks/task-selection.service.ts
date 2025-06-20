import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, Firestore, getDocs, query, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { FamillyService } from '../famillyService/familly.service';
import { Tasks } from '../../interfaces/category';

/*
This service is responsible for handling the addition of tasks to the familly group.
It retrieves the tasks from the Tasks subcollection of the familly group to be displayed in the homepage.
*/

@Injectable({
	providedIn: 'root',
})
export class TaskSelectionService {
	constructor(private readonly _firestore: Firestore, private readonly _famillyService: FamillyService) {}

	//This method is used to add a task to the familly group.
	public async addTask(task: Tasks): Promise<void> {
		try {
			// Get the familly group name from the FamillyService
			const famillyGroupName = await this._famillyService.getFamillyGroupName();

			// Check if the familly group name is set
			if (!famillyGroupName) {
				throw new Error('Familly group name is not set. Please set it before adding tasks.');
			}

			// Create a reference to the Tasks subcollection of the familly group
			const taskColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
			// Add the task to the Tasks subcollection
			await addDoc(taskColRef, task);
			console.log(`Task added successfully: ${JSON.stringify(task)}`);
		} catch (error) {
			console.error('Error adding task:', error);
			throw new Error('Failed to add task. Please try again later.');
		}
	}

	// public async removeTask(task: Task) {
	// 	const famillyGroupName = await this._famillyService.getFamillyGroupName();
	// 	if (!famillyGroupName) {
	// 		throw new Error('Familly group name is not set. Please set it before adding tasks.');
	// 	}

	// 	try {
	// 		const taskColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
	// 		const taskQuery = query(taskColRef, where('uuid', '==', task.uuid));
	// 		const taskSnapshot = await getDocs(taskQuery);
	// 		if (!taskSnapshot.empty) {
	// 			taskSnapshot.forEach(doc => {
	// 				deleteDoc(doc.ref);
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error('Error removing task:', error);
	// 		throw new Error('Failed to remove task. Please try again later.');
	// 	}
	// }

	public async validateTask(task: Tasks) {
		try {
			const updatedValidationStatus = !task.validated;

			const famillyGroupName = await this._famillyService.getFamillyGroupName();
			if (!famillyGroupName) {
				throw new Error('Familly group name is not set.');
			}

			const taskColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
			const taskQuery = query(taskColRef, where('uuid', '==', task.uuid));
			const taskSnapshot = await getDocs(taskQuery);

			if (taskSnapshot.empty) {
				console.warn('No task found with the given UUID:', task.uuid);
				return;
			}

			const batch = writeBatch(this._firestore);
			taskSnapshot.docs.forEach(doc => {
				batch.update(doc.ref, { validated: updatedValidationStatus });
			});

			await batch.commit();
			console.log(`Task validation status updated successfully for UUID: ${task.uuid}`);
		} catch (error) {
			console.error('Error validating task:', error);
			throw new Error('Failed to validate task. Please try again later.');
		}
	}

	//This method is used to get the tasks from the familly group.
	public async getTasksFromFamillyGroup(): Promise<Tasks[]> {
		try {
			const famillyGroupName = await this._famillyService.getFamillyGroupName();
			if (!famillyGroupName) {
				throw new Error('Familly group name is not set. Please set it before getting tasks.');
			}
			const taskColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Tasks');
			const taskSnapshot = await getDocs(taskColRef);
			const tasks: Tasks[] = taskSnapshot.docs.map(doc => ({
				...doc.data(),
				dueDate: doc.get('dueDate') || null,
			})) as Tasks[];
			return tasks;
		} catch (error) {
			console.error('Error fetching tasks:', error);
			throw new Error('Failed to fetch tasks. Please try again later.');
		}
	}
}
