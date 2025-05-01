import { Component, OnInit } from '@angular/core';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { AuthService } from '../../../services/auth/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Auth, User } from '@angular/fire/auth';
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
	ModalController,
	IonRefresher,
	IonRefresherContent,
} from '@ionic/angular/standalone';
import { collection, Firestore, getDocs, QuerySnapshot } from '@angular/fire/firestore';
import { ProfilePageComponent } from '../profile-page/profile-page.component';
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
	IonRefresher,
	IonRefresherContent,
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
	// public user?: User | null;
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
		private readonly _modalCtrl: ModalController,
		private readonly _auth: Auth,
	) {
		registerLocaleData(localeFr);
		this.userObs = this._authService.user$;

		// this.taskDescription$ = this._taskSelectionService.taskDescription$;
	}

	async ionViewWillEnter() {
		const user = this._auth.currentUser;
		console.log('User:', user);
		await this.getData();
	}

	public async openProfileModal() {
		const modal = await this._modalCtrl.create({
			component: ProfilePageComponent,
			componentProps: {
				user: await firstValueFrom(this.userObs),
			},
		});
		await modal.present();
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

	public async getData() {
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

	handleRefresh(event: CustomEvent) {
		setTimeout(() => {
			this.getData();
			(event.target as HTMLIonRefresherElement).complete();
		}, 2000);
	}
}
