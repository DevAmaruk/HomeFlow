import { Component } from '@angular/core';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Tasks } from '../../../interfaces/category';
import {
	IonAvatar,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonFab,
	IonFabButton,
	IonGrid,
	IonIcon,
	IonImg,
	IonRow,
	IonText,
	IonHeader,
	IonToolbar,
	IonList,
} from '@ionic/angular/standalone';
import { collection, Firestore, getDocs, QuerySnapshot } from '@angular/fire/firestore';
/*
This component is used to display the hompage of the chores section.
It will list all the chores that are added to the familly group as active chores.
It allows to add a new member to the familly group.
*/

const ionicElements = [
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonText,
	IonFab,
	IonFabButton,
	IonIcon,
	IonCard,
	IonCardContent,
	IonAvatar,
	IonImg,
	IonHeader,
	IonToolbar,
	IonList,
];

@Component({
	selector: 'app-chore-homepage',
	imports: [CommonModule, ...ionicElements],
	templateUrl: './chore-homepage.component.html',
	styleUrl: './chore-homepage.component.scss',
})
export class ChoreHomepageComponent {
	public taskDescription$?: Observable<string[]>;
	public taskDescriptions: Tasks[] = [];

	public userObs: Observable<User | null>;
	public user?: User | null;
	public username: string = '';

	public todayTasks: Tasks[] = [];
	public selectedDate: Date = new Date();

	public validatedTask: boolean = false;

	constructor(
		private readonly _taskSelectionService: TaskSelectionService,
		private readonly _famillyService: FamillyService,
		private readonly _authService: AuthService,
		private readonly _router: Router,
		private readonly _firestore: Firestore,
	) {
		registerLocaleData(localeFr);
		this.userObs = this._authService.user$;
		// this.taskDescription$ = this._taskSelectionService.taskDescription$;
	}

	async ionViewWillEnter() {
		try {
			const userData = await this._authService.getUserData();
			if (userData) {
				this.username = userData.username;
			}
			this.taskDescriptions = await this._taskSelectionService.getTasksFromFamillyGroup();

			this.updateTasksForSelectedDate();
		} catch (error) {
			console.error('Error fetching tasks on page load:', error);
		}
	}

	// Update tasks based on the selected date
	private updateTasksForSelectedDate() {
		if (!this.taskDescriptions || this.taskDescriptions.length === 0) {
			this.todayTasks = [];
			return;
		}

		const formattedDate = this.selectedDate.toISOString().split('T')[0];

		this.todayTasks = this.taskDescriptions.filter(task => {
			const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
			return taskDate === formattedDate;
		});
	}

	public previousDay() {
		this.selectedDate = new Date(this.selectedDate.getTime() - 24 * 60 * 60 * 1000);
		this.updateTasksForSelectedDate();
	}

	public nextDay() {
		this.selectedDate = new Date(this.selectedDate.getTime() + 24 * 60 * 60 * 1000);
		this.updateTasksForSelectedDate();
	}

	public async addMemberToFamilly(memberId: string) {
		try {
			await this._famillyService.addMemberToFamillyGroup(memberId);
			// console.log('Member added to family group successfully!');
		} catch (error) {
			console.error('Error adding member to family group:', error);
		}
	}

	public goToCalendar() {
		this._router.navigate(['calendar']);
	}

	public async onSignOut() {
		await this._authService.signOut();
		this._router.navigate(['/login']);
	}

	public async validateTask(task: Tasks) {
		try {
			await this._taskSelectionService.validateTask(task);

			const taskIndex = this.todayTasks.findIndex(t => t.uuid === task.uuid);
			if (taskIndex !== -1) {
				this.todayTasks[taskIndex].validated = !this.todayTasks[taskIndex].validated;
			}
		} catch (error) {
			console.error('Error validating task:', error);
		}
	}

	public goToCategoryPage() {
		this._router.navigate(['/category']);
	}
}
