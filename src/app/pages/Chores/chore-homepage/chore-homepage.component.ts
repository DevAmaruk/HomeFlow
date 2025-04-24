import { Component } from '@angular/core';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { Task } from '../../../interfaces/categories';
import localeFr from '@angular/common/locales/fr';
/*
This component is used to display the hompage of the chores section.
It will list all the chores that are added to the familly group as active chores.
It allows to add a new member to the familly group.
*/

@Component({
	selector: 'app-chore-homepage',
	imports: [RouterLink, CommonModule],
	templateUrl: './chore-homepage.component.html',
	styleUrl: './chore-homepage.component.scss',
})
export class ChoreHomepageComponent {
	public taskDescription$?: Observable<string[]>;
	public taskDescriptions: Task[] = [];

	public userObs: Observable<User | null>;
	public user?: User | null;

	public todayTasks: Task[] = [];
	public selectedDate: Date = new Date();

	public validatedTask: boolean = false;

	constructor(
		private readonly _taskSelectionService: TaskSelectionService,
		private readonly _famillyService: FamillyService,
		private readonly _authService: AuthService,
		private readonly _router: Router,
	) {
		registerLocaleData(localeFr);
		this.userObs = this._authService.user$;
		this.taskDescription$ = this._taskSelectionService.taskDescription$;
	}

	async ngOnInit() {
		this.taskDescriptions = await this._taskSelectionService.getTasksFromFamillyGroup();

		const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

		this.todayTasks = this.taskDescriptions.filter(task => task.dueDate === currentDate);
	}

	// Update tasks based on the selected date
	private updateTasksForSelectedDate() {
		const formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'fr-FR');
		this.todayTasks = this.taskDescriptions.filter(task => task.dueDate === formattedDate);
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

	public async validateTask(task: Task) {
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
}
