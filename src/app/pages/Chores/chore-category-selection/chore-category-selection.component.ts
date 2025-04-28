import { Component, OnInit } from '@angular/core';
import { ChoreCategoryService } from '../../../services/chores/chore-category.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from '../../../services/databaseService/database.service';
import { Categories } from '../../../interfaces/category';
import { FamillyService } from '../../../services/famillyService/familly.service';

/* 
This component is responsible for selecting a chore category. 
It will be displayed as small cards with icons and texts that the user can click on.
Each card will open a new page with the tasks of that category.
At the bottom there will be a menu with the following :

- Calendar: Open the Calendar page
- Task List: Open the "homepage" of the chore section with the list of all tasks for the current day.
- Scoreboard: Open the scoreboard page
- Settings: Open the settings modal (TO THINK MORE ABOUT THIS ONE)
*/

@Component({
	selector: 'app-chore-category-selection',
	imports: [],
	templateUrl: './chore-category-selection.component.html',
	styleUrl: './chore-category-selection.component.scss',
})
export class ChoreCategorySelectionComponent implements OnInit {
	public readonly categories$?: Observable<Categories[]>;

	// We create a variable to store the categories
	public categories?: Categories[];

	/*
	First we need to inject the service in the constructor to use the method getChoreCategories() from the service

	We inject as well the Router to navigate to the tasks page when the user selects a category.
	*/
	constructor(
		private readonly _choreCatService: ChoreCategoryService,
		private readonly _route: Router,
		private readonly _databaseService: DatabaseService,
		private readonly _famillyService: FamillyService,
	) {
		this.categories$ = this._choreCatService.categories$;
	}

	async ngOnInit() {
		this.getCategories();
	}

	// Assign the return of getChoreCategories() to the categories
	// categories is an array of Category objects
	async getCategories() {
		try {
			const famillyGroupName = await this._famillyService.getFamillyGroupName();
			if (!famillyGroupName) {
				throw new Error('Familly group name not found');
			}

			this.categories = await this._databaseService.getAllCategories(famillyGroupName);
			console.log('Combined categories:', this.categories); // Debugging
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
		// this.categories = await this._databaseService.getCategoriesDatabase();
		// console.log('Fetched categories:', this.categories); // Debugging
	}

	// This method allows to navigate to the tasks page when the user selects a category.
	async onCategorySelected(categoryId: string) {
		this._route.navigate(['/tasks', categoryId]);
	}

	public backToHome() {
		this._route.navigate(['/chore-homepage']);
	}

	public goToCustomTask() {
		this._route.navigate(['/custom-task-creation']);
	}
}
