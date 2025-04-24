import { Component } from '@angular/core';
import { Category, Task } from '../../../interfaces/categories';
import { CustomTaskCreationService } from '../../../services/tasks/custom-task-creation.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*
This component is used to create a custom task that will be sent to Firestore as new custom task.
*/

@Component({
	selector: 'app-custom-task-creation',
	imports: [FormsModule, CommonModule, ReactiveFormsModule],
	templateUrl: './custom-task-creation.component.html',
	styleUrl: './custom-task-creation.component.scss',
})
export class CustomTaskCreationComponent {
	public newTask: Partial<Task> = {
		description: '',
		icon: '',
		score: 0,
	};

	public newCategory: Partial<Category> = {
		title: '',
		icon: '',
	};

	constructor(private readonly _customTaskCreationService: CustomTaskCreationService) {}

	public async addCustomCategory() {
		// Ensure required fields are filled
		if (!this.newCategory.title) {
			alert('Please enter a category title.');
			return;
		}

		// Create the category object
		const category = {
			uuid: crypto.randomUUID(), // Generate a unique ID
			title: this.newCategory.title,
			icon: this.newCategory.icon || '', // Default to empty if no icon is provided
		};

		// Send the category to Firestore
		await this._customTaskCreationService.addCustomCategoryToDatabase(category);

		alert('Category created successfully!');
		this.resetFormCat();
	}

	private resetFormCat() {
		// Reset the form fields
		this.newCategory = { title: '', icon: '' };
	}

	public async addCustomTask() {
		if (!this.newTask.description) {
			alert('Please enter a task description.');
			return;
		}

		const newTask: Task = {
			uuid: crypto.randomUUID(),
			icon: this.newTask.icon || '',
			description: this.newTask.description || '',
			score: this.newTask.score || 0,
			dueDate: '',
			frequency: '',
			assignee: '',
			validated: false,
		};

		await this._customTaskCreationService.addCustomTaskToUserDatabase(newTask);

		alert('Task created successfully!');
		this.resetForm();
	}

	private resetForm() {
		// Reset the form fields
		this.newTask = { description: '', icon: '', score: 0 };
	}
}
