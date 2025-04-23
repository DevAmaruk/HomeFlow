import { Component } from '@angular/core';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
	public taskDescriptions: string[] = [];

	public userObs: Observable<User | null>;
	public user?: User | null;

	constructor(
		private readonly _taskSelectionService: TaskSelectionService,
		private readonly _famillyService: FamillyService,
		private readonly _authService: AuthService,
	) {
		this.userObs = this._authService.user$;
		this.taskDescription$ = this._taskSelectionService.taskDescription$;
	}

	async ngOnInit() {
		this.taskDescriptions = await this._taskSelectionService.getTasksFromFamillyGroup();
	}

	public async addMemberToFamilly(memberId: string) {
		try {
			await this._famillyService.addMemberToFamillyGroup(memberId);
			// console.log('Member added to family group successfully!');
		} catch (error) {
			console.error('Error adding member to family group:', error);
		}
	}
}
