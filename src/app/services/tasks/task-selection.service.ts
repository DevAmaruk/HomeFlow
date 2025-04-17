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

	constructor(private readonly _firestore: Firestore) {
		this.getTasksDescription();
	}

	async addTask(task: Task) {
		const tasksCollectionRef = collection(this._firestore, 'default-db');
		await addDoc(tasksCollectionRef, task);
	}

	async getTasksDescription() {
		const tasksCollectionRef = collection(this._firestore, 'default-db');
		const q = query(tasksCollectionRef);

		this.taskDescription$ = collectionData(q).pipe(map((tasks: any[]) => tasks.map(task => task.description)));
	}
}
