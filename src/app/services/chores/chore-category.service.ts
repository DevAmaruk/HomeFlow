import { Injectable } from '@angular/core';
import { DatabaseService } from '../databaseService/database.service';
import { Categories, Tasks } from '../../interfaces/category';
import { BehaviorSubject } from 'rxjs';

/*
This service is responsible to fetch the data from the default database JSON file.
If I call the service from the chore-selection category component, it will return the data from the JSON
allowing me to store each title of each category in a variable and loop through it to display in the cards.
*/

@Injectable({
	providedIn: 'root',
})
export class ChoreCategoryService {
	//We created two Observables. One is for the categories and the other one is for the tasks.
	private _categoriesSubject$: BehaviorSubject<Categories[]> = new BehaviorSubject<Categories[]>([]);

	public categories$ = this._categoriesSubject$.asObservable();

	// First we need to inject in the constructor the HttpClient to use it in the service
	constructor(private readonly _databaseService: DatabaseService) {}

	// // We need an async method to fetch the data from the JSON and return a response from it.
	// // It returns a promise of an array of categories.
	// async getChoreCategories(): Promise<Category[]> {
	// 	const URL = './CategoriesDB/default-database-fr.json';
	// 	const REQUEST = this._http.get<Category[]>(URL);
	// 	const RESPONSE = await firstValueFrom(REQUEST);
	// 	this._categoriesSubject$.next(RESPONSE);
	// 	return RESPONSE;
	// }

	async getCategoryById(categoryId: string): Promise<Categories | undefined> {
		const categories = await this._databaseService.getCategoriesDatabase();
		if (categories) {
			const selectedCategory = categories.find(cat => cat.uuid === categoryId);
			return selectedCategory;
		} else {
			return undefined;
		}
	}

	// This method is used to get the tasks by category ID.
	async getTasksByCategoryId(categoryId: string): Promise<Tasks[]> {
		const tasks = await this._databaseService.getTasksDatabase();
		return tasks.filter(task => task.categoryUuid === categoryId);
		// const categories = await this._databaseService.getCategoriesDatabase();
		// const selectedCategory = categories.find(cat => cat.uuid === categoryId);
		// if (selectedCategory) {
		// 	return selectedCategory.tasks;
		// } else {
		// 	return [];
		// }
	}
}
