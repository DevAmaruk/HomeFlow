import { Component, OnInit } from '@angular/core';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { Task } from '../../../interfaces/categories';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { first, firstValueFrom, Observable } from 'rxjs';
import { FamillyService } from '../../../services/famillyService/familly.service';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
	selector: 'app-chore-list-homepage',
	imports: [RouterLink, CommonModule],
	templateUrl: './chore-list-homepage.component.html',
	styleUrl: './chore-list-homepage.component.scss',
})
export class ChoreListHomepageComponent implements OnInit {
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
