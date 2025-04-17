import { Component, OnInit } from '@angular/core';
import { ChoreCategoryService } from '../../../services/chores/chore-category.service';
import { Category } from '../../../interfaces/categories';
import { Router } from '@angular/router';

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
	/*
	First we need to inject the service in the constructor to use the method getChoreCategories() from the service

	We inject as well the Router to navigate to the tasks page when the user selects a category.
	*/
	constructor(private readonly _choreCatService: ChoreCategoryService, private readonly _route: Router) {}

	// We create a variable to store the categories
	public categories?: Category[];

	async ngOnInit() {
		this.getCategories();
	}

	// We create a method to assign the categories to the variable
	async getCategories() {
		this.categories = await this._choreCatService.getChoreCategories();
	}

	// This method allows to navigate to the tasks page when the user selects a category.
	async onCategorySelected(categoryId: string) {
		this._route.navigate(['/tasks', categoryId]);
	}
}
