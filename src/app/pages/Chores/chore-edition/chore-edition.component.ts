import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../../interfaces/categories';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/databaseService/database.service';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';

/*
This class is used when a user wants to edit a chore.
It is called just after selecting the chore the user wants to add to the list.
*/

@Component({
	selector: 'app-chore-edition',
	imports: [CommonModule],
	templateUrl: './chore-edition.component.html',
	styleUrl: './chore-edition.component.scss',
})
export class ChoreEditionComponent implements OnInit {
	public task: Task | null = null;

	public taskDescription: string | null = null;

	public famillyGroupName: string | null = null;

	constructor(
		private readonly _activeRoute: ActivatedRoute,
		private readonly _firestore: Firestore,
		private readonly _famillyService: FamillyService,
		private readonly _databaseService: DatabaseService,
		private readonly _router: Router,
		private readonly _taskSelectionService: TaskSelectionService,
	) {}

	async ngOnInit() {
		this.famillyGroupName = await this._famillyService.getFamillyGroupName();
		this.getTask();
	}

	public async getTask() {
		const taskId = this._activeRoute.snapshot.paramMap.get('taskId');

		try {
			if (taskId) {
				if (!this.famillyGroupName) {
					throw new Error('Familly group not found');
				}

				const taskColRef = collection(this._firestore, 'Familly', this.famillyGroupName, 'Tasks');
				const taskQuery = query(taskColRef, where('uuid', '==', taskId));
				const taskSnapshot = await getDocs(taskQuery);

				if (!taskSnapshot.empty) {
					taskSnapshot.forEach(doc => {
						this.task = doc.data() as Task;
						this.taskDescription = doc.get('description');
					});
				} else {
					console.log('Task not found in Firestore. Switching to local database');
					const localTask = await this._databaseService.getTask(taskId);
					if (localTask) {
						this.task = localTask;
						this.taskDescription = localTask.description;
					}
					console.log('Getting tasks from the local database:', this.task);
				}
			}
		} catch (error) {
			console.error('Error getting task:', error);
		}
	}

	async addTask(task: Task) {
		await this._taskSelectionService.addTask(task);
	}

	public backToCat() {
		this._router.navigate(['category']);
	}
}
