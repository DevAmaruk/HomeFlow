import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Categories, Tasks } from '../../interfaces/category';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';

/*
This service is responsible for fetching the data from the default database JSON file and Firestore user database.
*/

@Injectable({
	providedIn: 'root',
})
export class DatabaseService {
	constructor(private readonly _http: HttpClient, private readonly _firestore: Firestore) {
		this.getTasksDatabase();
	}

	public async getCategoriesDatabase(): Promise<Categories[]> {
		const URL = './CategoriesDB/default-database.json';
		const REQUEST = this._http.get<{ categories: Categories[] }>(URL);
		const RESPONSE = await firstValueFrom(REQUEST);
		return RESPONSE.categories;
	}

	public async getTasksDatabase(): Promise<Tasks[]> {
		const URL = './CategoriesDB/default-database.json';
		const REQUEST = this._http.get<{ tasks: Tasks[] }>(URL);
		const RESPONSE = await firstValueFrom(REQUEST);
		return RESPONSE.tasks;
	}

	public async getTask(taskId: string, famillyGroupName: string): Promise<Tasks> {
		// const categories = await this.getCategoriesDatabase();
		// console.log('Fetched categories:', categories);
		// console.log('Looking for task with ID:', taskId);

		try {
			const tasks = await this.getTasksDatabase();
			const task = tasks.find(task => task.uuid === taskId);

			if (task) {
				return task;
			}

			const tasksColRef = collection(this._firestore, 'Familly', famillyGroupName, 'UserDatabase');
			const tasksQuery = query(tasksColRef, where('uuid', '==', taskId));
			const taskSnapshot = await getDocs(tasksQuery);

			if (!taskSnapshot.empty) {
				const firestoreTask = taskSnapshot.docs[0].data() as Tasks;
				return firestoreTask; // Return the task if found in Firestore
			}

			throw new Error('Task not found in both local database and Firestore');
		} catch (error) {
			console.error('Error fetching task:', error);
			throw new Error('Failed to fetch task.');
		}
		// const tasks = await this.getTasksDatabase();
		// const task = tasks.find(task => task.uuid === taskId);
		// if (task) {
		// 	return task;
		// }
		// for (const task of tasks) {
		// 	const task = category.tasks.find(task => task.uuid === taskId);
		// 	if (task) {
		// 		return task;
		// 	}
		// }

		// throw new Error('Task not found in local database');
	}

	public async getAllCategories(famillyGroupName: string): Promise<Categories[]> {
		try {
			const defaultCategories = await this.getCategoriesDatabase();

			const categoriesColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Categories');
			const categoriesSnapshot = await getDocs(categoriesColRef);
			const customCategories: Categories[] = categoriesSnapshot.docs.map(doc => doc.data() as Categories);

			return [...defaultCategories, ...customCategories];
		} catch (error) {
			console.error('Error fetching all categories:', error);
			throw new Error('Failed to fetch categories.');
		}
	}

	public async getAllTasksByCategory(categoryUuid: string, famillyGroupName: string) {
		try {
			const defaultTasks = await this.getTasksDatabase();
			const filteredDefaultTasks = defaultTasks.filter(task => task.categoryUuid === categoryUuid);

			const tasksColRef = collection(this._firestore, 'Familly', famillyGroupName, 'UserDatabase');
			const tasksQuery = query(tasksColRef, where('categoryUuid', '==', categoryUuid));
			const customTasksSnapshot = await getDocs(tasksQuery);
			const customTasks: Tasks[] = customTasksSnapshot.docs.map(doc => doc.data() as Tasks);

			return [...filteredDefaultTasks, ...customTasks];
		} catch (error) {
			console.error('Error fetching tasks by category:', error);
			throw new Error('Failed to fetch tasks.');
		}
	}
}
