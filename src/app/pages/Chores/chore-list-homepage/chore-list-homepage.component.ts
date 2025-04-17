import { Component, OnInit } from '@angular/core';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { Task } from '../../../interfaces/categories';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { collection, collectionData, deleteDoc, doc, Firestore, getDocs, query, where } from '@angular/fire/firestore';

@Component({
	selector: 'app-chore-list-homepage',
	imports: [RouterLink, CommonModule],
	templateUrl: './chore-list-homepage.component.html',
	styleUrl: './chore-list-homepage.component.scss',
})
export class ChoreListHomepageComponent implements OnInit {
	public selectedTasks: Task[] = [];

	public taskDescription$?: Observable<string[]>;

	constructor(private readonly _taskSelectionService: TaskSelectionService) {}

	async ngOnInit() {
		this.taskDescription$ = this._taskSelectionService.taskDescription$;
	}
}
