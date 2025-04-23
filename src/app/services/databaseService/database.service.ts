import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { Category, Task } from '../../interfaces/categories';

/*
This service is responsible for fetching the data from the default database JSON file and Firestore user database.
*/

@Injectable({
	providedIn: 'root',
})
export class DatabaseService {
	constructor(private readonly _http: HttpClient) {
		this.getTasksDatabase();
	}

	public async getCategoriesDatabase(): Promise<Category[]> {
		const URL = './CategoriesDB/default-database-fr.json';
		const REQUEST = this._http.get<Category[]>(URL);
		const RESPONSE = await firstValueFrom(REQUEST);
		return RESPONSE;
	}

	public async getTasksDatabase(): Promise<Task[]> {
		const URL = './CategoriesDB/default-database-fr.json';
		const REQUEST = this._http.get<Task[]>(URL);
		const RESPONSE = await firstValueFrom(REQUEST);
		return RESPONSE;
	}

	public async getTask(taskId: string): Promise<Task> {
		const categories = await this.getCategoriesDatabase();
		console.log('Fetched categories:', categories);
		console.log('Looking for task with ID:', taskId);

		for (const category of categories) {
			const task = category.tasks.find(task => task.uuid === taskId);
			if (task) {
				return task;
			}
		}

		throw new Error('Task not found in local database');
	}
}
