import { Component, OnInit } from '@angular/core';
import { CustomTaskCreationService } from '../../../services/tasks/custom-task-creation.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Categories, Tasks } from '../../../interfaces/category';
import { Router } from '@angular/router';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonGrid,
	IonImg,
	IonInput,
	IonLabel,
	IonList,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonText,
} from '@ionic/angular/standalone';

/*
This component is used to create a custom task that will be sent to Firestore as new custom task.
*/

const ionicElements = [
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonText,
	IonInput,
	IonLabel,
	IonSelect,
	IonSelectOption,
	IonButton,
	IonCard,
	IonCardContent,
	IonList,
	IonImg,
];

@Component({
	selector: 'app-custom-task-creation',
	imports: [FormsModule, CommonModule, ReactiveFormsModule, ...ionicElements],
	templateUrl: './custom-task-creation.component.html',
	styleUrl: './custom-task-creation.component.scss',
})
export class CustomTaskCreationComponent implements OnInit {
	public newTask: Partial<Tasks> = {
		description: '',
		icon: '',
		score: 0,
		categoryUuid: '',
	};

	public newCategory: Partial<Categories> = {
		title: '',
		icon: '',
	};

	public categories: Categories[] = [];

	async ngOnInit() {
		await this.loadCategories();
	}

	constructor(private readonly _customTaskCreationService: CustomTaskCreationService, private readonly _router: Router) {}

	private async loadCategories() {
		try {
			this.categories = await this._customTaskCreationService.getAllCategories();
			console.log('Fetched categories:', this.categories); // Debugging
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

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

		if (!this.newTask.categoryUuid) {
			alert('Please select a category.');
			return;
		}

		const newTask: Tasks = {
			uuid: crypto.randomUUID(),
			icon: this.newTask.icon || '',
			description: this.newTask.description || '',
			score: this.newTask.score || 0,
			dueDate: '',
			frequency: '',
			assignee: '',
			validated: false,
			categoryUuid: this.newTask.categoryUuid || '', // Ensure categoryUuid is set
		};

		await this._customTaskCreationService.addCustomTaskToUserDatabase(newTask);

		alert('Task created successfully!');
		this.resetForm();
	}

	private resetForm() {
		// Reset the form fields
		this.newTask = { description: '', icon: '', score: 0, categoryUuid: '' };
	}

	public backToCat() {
		this._router.navigate(['/category']);
	}
}
