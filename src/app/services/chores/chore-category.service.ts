import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category, Task } from '../../interfaces/categories';

/*
This service is responsible to fetch the data from the default database JSON file.
If I call the service from the chore-selection category component, it will return the data from the JSON
allowing me to store each title of each category in a variable and loop through it to display in the cards.
*/

@Injectable({
	providedIn: 'root',
})
export class ChoreCategoryService {
	// First we need to inject in the constructor the HttpClient to use it in the service
	constructor(private readonly _http: HttpClient) {}

	// We need an async method to fetch the data from the JSON and return a response from it.
	async getChoreCategories(): Promise<Category[]> {
		const URL = './CategoriesDB/default-database.json';
		const REQUEST = this._http.get<Category[]>(URL);
		const RESPONSE = await firstValueFrom(REQUEST);
		return RESPONSE;
	}

	async getTasksByCategory(categoryId: string): Promise<Task[]> {
		const categories = await this.getChoreCategories();
		const task = categories.find(category => category.uuid === categoryId);
		if (task) {
			return task.tasks;
		}
		return [];
	}
}
