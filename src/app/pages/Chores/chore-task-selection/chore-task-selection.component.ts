import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChoreCategoryService } from '../../../services/chores/chore-category.service';
import { Category, Task } from '../../../interfaces/categories';

/*
This component is responsible for selecting a chore task based on the selected category.
It will also be displayed on a card.
Upon selecting a task, the chore-list array is updated with the selected task.
So we need to push the selected task to the chore-list array, which will be displayed on the Chore-List Homepage component.
*/

@Component({
	selector: 'app-chore-task-selection',
	imports: [],
	templateUrl: './chore-task-selection.component.html',
	styleUrl: './chore-task-selection.component.scss',
})
export class ChoreTaskSelectionComponent implements OnInit {
	// Variable to store the task from a specific category
	public tasks?: Task[] | undefined;

	/*
  First we need to inject the ActivatedRoute to get the categoryId from the URL.
  Then we can use this categoryId to get the tasks of that category.
  */
	constructor(private readonly _activeRoute: ActivatedRoute, private readonly _choreCatService: ChoreCategoryService) {}

	async ngOnInit() {
		this.getTasks();
	}

	// This method takes first the categoryId from the URL, then if the categoryId is not null, we can get the categories from the service.
	// Then we can find the selected category by comparing the uuid of the category with the categoryId from the URL.
	// Finally we can assign the tasks of the selected category to the tasks variable.
	// We display it on the HTML page using a loop @for
	async getTasks() {
		const categoryId: string | null = this._activeRoute.snapshot.paramMap.get('categoryId');
		if (categoryId) {
			const categories: Category[] = await this._choreCatService.getChoreCategories();
			const selectedCategory: Category | undefined = categories.find(cat => cat.uuid === categoryId);
			this.tasks = selectedCategory!.tasks;
		}
	}
}
