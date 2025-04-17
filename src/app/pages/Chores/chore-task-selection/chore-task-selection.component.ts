import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChoreCategoryService } from '../../../services/chores/chore-category.service';
import { Category, Task } from '../../../interfaces/categories';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';

/*
This component is responsible for selecting a chore task based on the selected category.
It will also be displayed on a card.
Upon selecting a task, the chore-list array is updated with the selected task.
So we need to push the selected task to the chore-list array, which will be displayed on the Chore-List Homepage component.
*/

@Component({
	selector: 'app-chore-task-selection',
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: './chore-task-selection.component.html',
	styleUrl: './chore-task-selection.component.scss',
})
export class ChoreTaskSelectionComponent implements OnInit {
	// Variable to store the task from a specific category
	public tasks?: Task[] | undefined;
	public selectedCategory?: Category | undefined;

	public taskGroup = new FormGroup({
		tasks: new FormArray<any>([]),
	});

	/*
  First we need to inject the ActivatedRoute to get the categoryId from the URL.
  Then we can use this categoryId to get the tasks of that category.
  */
	constructor(
		private readonly _activeRoute: ActivatedRoute,
		private readonly _choreCatService: ChoreCategoryService,
		private readonly _taskSelectionService: TaskSelectionService,
	) {}

	async ngOnInit() {
		this.getTasks();
		this.getCategory();
	}

	// This method takes first the categoryId from the URL, then if the categoryId is not null, we can get the categories from the service.
	// Then we can find the selected category by comparing the uuid of the category with the categoryId from the URL.
	// Finally we can assign the tasks of the selected category to the tasks variable.
	// We display it on the HTML page using a loop @for
	async getTasks() {
		const categoryId: string | null = this._activeRoute.snapshot.paramMap.get('categoryId');
		if (categoryId) {
			this.tasks = await this._choreCatService.getTasksByCategoryId(categoryId);
		}
	}

	async getCategory() {
		const categoryId: string | null = this._activeRoute.snapshot.paramMap.get('categoryId');
		if (categoryId) {
			this.selectedCategory = await this._choreCatService.getCategoryById(categoryId);
		}
	}

	async addTask(task: Task) {
		const tasksArray = this.taskGroup.get('tasks') as FormArray;
		tasksArray.push(new FormControl(task));
		this._taskSelectionService.selectedTasks.push(task);
		await this._taskSelectionService.addTask(task);
		console.log(tasksArray);
	}
}
