import { Component, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/categories';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-chore-list-homepage',
	imports: [CommonModule],
	templateUrl: './chore-list-homepage.component.html',
	styleUrl: './chore-list-homepage.component.scss',
})
export class ChoreListHomepageComponent implements OnInit {
	async ngOnInit() {}
	constructor(public readonly _taskSeletionService: TaskSelectionService) {}
}
