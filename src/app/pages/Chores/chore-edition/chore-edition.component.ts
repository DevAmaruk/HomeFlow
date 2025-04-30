import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/databaseService/database.service';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tasks } from '../../../interfaces/category';
import {
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonText,
	IonToolbar,
	IonLabel,
	IonDatetime,
	IonButton,
	IonFab,
	IonFabButton,
	IonImg,
	IonToast,
	IonButtons,
} from '@ionic/angular/standalone';

/*
This class is used when a user wants to edit a chore.
It is called just after selecting the chore the user wants to add to the list.
*/

const ionicElements = [
	IonContent,
	IonGrid,
	IonCol,
	IonRow,
	IonHeader,
	IonToolbar,
	IonText,
	IonSelect,
	IonSelectOption,
	IonLabel,
	IonDatetime,
	IonButton,
	IonFab,
	IonFabButton,
	IonImg,
	IonToast,
];

@Component({
	selector: 'app-chore-edition',
	imports: [CommonModule, ReactiveFormsModule, FormsModule, ...ionicElements],
	templateUrl: './chore-edition.component.html',
	styleUrl: './chore-edition.component.scss',
})
export class ChoreEditionComponent implements OnInit {
	public task: Tasks | null = null;

	public taskDescription: string | null = null;

	public famillyGroupName: string | null = null;

	public toastButtons = [
		{
			text: 'Retirer',
			role: 'cancel',
			handler: () => {
				console.log('Dismiss clicked');
			},
		},
	];

	setRoleMessage(event: CustomEvent) {
		const { role } = event.detail;
		console.log(`Dismissed with role: ${role}`);
	}

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
						this.task = doc.data() as Tasks;
						this.taskDescription = doc.get('description');
					});
				} else {
					console.log('Task not found in Firestore. Switching to local database');
					const localTask = await this._databaseService.getTask(taskId, this.famillyGroupName);
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

	async addTask(task: Tasks) {
		task.frequency = task.frequency || 'none';

		if (task.frequency === 'none') {
			await this._taskSelectionService.addTask(task);
		} else {
			await this.handleRepeatingTask(task);
		}
	}

	private async handleRepeatingTask(task: Tasks) {
		let currentDate = new Date(task.dueDate);

		for (let i = 0; i < 10; i++) {
			// Example: Repeat 10 times
			if (task.frequency === 'daily') {
				currentDate.setDate(currentDate.getDate() + 1);
			} else if (task.frequency === 'weekly') {
				currentDate.setDate(currentDate.getDate() + 7);
			} else if (task.frequency === 'monthly') {
				currentDate.setMonth(currentDate.getMonth() + 1);
			}

			const repeatedTask: Tasks = {
				...task,
				uuid: this.generateUUID(),
				dueDate: currentDate.toISOString().split('T')[0],
			};

			await this._taskSelectionService.addTask(repeatedTask);
		}
	}

	private generateUUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	public backToCat() {
		this._router.navigate(['category']);
	}
}
