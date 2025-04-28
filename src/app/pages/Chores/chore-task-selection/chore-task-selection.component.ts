import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChoreCategoryService } from '../../../services/chores/chore-category.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Categories, Tasks } from '../../../interfaces/category';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { DatabaseService } from '../../../services/databaseService/database.service';

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
	public tasks: Tasks[] | undefined;
	public selectedCategory?: Categories | undefined;

	public userObs: Observable<User | null>;
	public user?: User | null;

	// public taskGroup = new FormGroup({
	// 	tasks: new FormArray<any>([]),
	// });

	public famillyGroupName: string = '';
	public uid?: string | null;

	/*
  First we need to inject the ActivatedRoute to get the categoryId from the URL.
  Then we can use this categoryId to get the tasks of that category.
  */
	constructor(
		private readonly _activeRoute: ActivatedRoute,
		private readonly _router: Router,
		private readonly _choreCatService: ChoreCategoryService,
		private readonly _authService: AuthService,
		private readonly _famillyService: FamillyService,
		private readonly _databaseService: DatabaseService,
	) {
		this.userObs = this._authService.user$;
	}

	async ngOnInit() {
		this.getTasks();
		this.getCategory();
	}

	// This method takes first the categoryId from the URL, then if the categoryId is not null, we can get the categories from the service.
	// Then we can find the selected category by comparing the uuid of the category with the categoryId from the URL.
	// Finally we can assign the tasks of the selected category to the tasks variable.
	// We display it on the HTML page using a loop @for
	async getTasks() {
		try {
			const categoryId: string | null = this._activeRoute.snapshot.paramMap.get('categoryId');
			if (!categoryId) {
				throw new Error('Category ID is not provided.');
			}

			const famillyGroupName = await this._famillyService.getFamillyGroupName();
			if (!famillyGroupName) {
				throw new Error('Familly group name is not set.');
			}

			this.tasks = await this._databaseService.getAllTasksByCategory(categoryId, famillyGroupName);
			console.log('Combined tasks:', this.tasks); // Debugging
		} catch (error) {
			console.error('Error fetching tasks:', error);
		}
	}

	async getCategory() {
		const categoryId: string | null = this._activeRoute.snapshot.paramMap.get('categoryId');
		if (categoryId) {
			this.selectedCategory = await this._choreCatService.getCategoryById(categoryId);
		}
	}

	public async onTaskSelected(task: Tasks) {
		if (task) {
			this._router.navigate(['/chore-edition', task.uuid]);
		}
	}
}
