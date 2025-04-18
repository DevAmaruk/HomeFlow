import { Injectable } from '@angular/core';
import { Task } from '../../interfaces/categories';
import { addDoc, collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

/*
This service will create a FormArray with the tasks selected by the user.
It will be injected in the homepage.
*/

@Injectable({
	providedIn: 'root',
})
export class TaskSelectionService {
	public selectedTasks: Task[] = [];

	public taskDescription$?: Observable<string[]>;

	private famillyGroupCollectionName?: string;

	constructor(private readonly _firestore: Firestore) {
		this.getTasksDescription();
	}

	async setFamillyGroup(famillyName: string) {
		this.famillyGroupCollectionName = famillyName;
	}

	async addTask(task: Task) {
		if (!this.famillyGroupCollectionName) {
			throw new Error('Familly group collection name is not set. Please set it before adding tasks.');
		}
		const tasksCollectionRef = collection(this._firestore, this.famillyGroupCollectionName);
		await addDoc(tasksCollectionRef, task);
	}

	async getTasksDescription() {
		if (!this.famillyGroupCollectionName) {
			throw new Error('Familly group collection name is not set. Please set it before getting tasks.');
		}
		const tasksCollectionRef = collection(this._firestore, this.famillyGroupCollectionName);
		const q = query(tasksCollectionRef);

		this.taskDescription$ = collectionData(q).pipe(map((tasks: any[]) => tasks.map(task => task.description)));
	}
}
