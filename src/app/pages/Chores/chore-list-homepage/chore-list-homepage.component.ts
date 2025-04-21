import { Component, OnInit } from '@angular/core';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { Task } from '../../../interfaces/categories';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FamillyService } from '../../../services/famillyService/familly.service';

@Component({
	selector: 'app-chore-list-homepage',
	imports: [RouterLink, CommonModule],
	templateUrl: './chore-list-homepage.component.html',
	styleUrl: './chore-list-homepage.component.scss',
})
export class ChoreListHomepageComponent implements OnInit {
	public selectedTasks: Task[] = [];

	public taskDescription$?: Observable<string[]>;

	constructor(private readonly _taskSelectionService: TaskSelectionService, private readonly _famillyService: FamillyService) {}

	async ngOnInit() {
		try {
			this.taskDescription$ = this._taskSelectionService.taskDescription$;

			await this._taskSelectionService.getTasksForFamilly('Ma famille');
		} catch (error) {
			console.error('Error fetching tasks:', error);
		}
	}

	public async addMemberToFamilly(memberId: string) {
		try {
			await this._famillyService.addMemberToFamillyGroup(memberId);
			console.log('Member added to family group successfully!');
		} catch (error) {
			console.error('Error adding member to family group:', error);
		}
	}
}
