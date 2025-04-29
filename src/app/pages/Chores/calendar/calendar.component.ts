import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { TaskSelectionService } from '../../../services/tasks/task-selection.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../interfaces/category';
import {
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonGrid,
	IonRow,
} from '@ionic/angular/standalone';

/*
This page is used to display the calendar for the chores. 
When the user clicks on a date, it will show below the chores for that date.
*/

const ionicElements = [
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonCard,
	IonCardContent,
];

@Component({
	selector: 'app-calendar',
	imports: [FullCalendarModule, CommonModule, ...ionicElements],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
	constructor(
		private readonly _taskSelectionService: TaskSelectionService,
		private readonly _router: Router,
	) {}

	public tasksForSelectedDate: Tasks[] = []; // Store tasks for the selected date
	public selectedDate: string | null = null; // Store the selected date

	public calendarOptions: CalendarOptions = {
		plugins: [dayGridPlugin, interactionPlugin],
		initialView: 'dayGridMonth',
		selectable: true,
		contentHeight: 'auto',
		showNonCurrentDates: false,
		firstDay: 1,
		locale: frLocale,
		timeZone: 'local',
		selectLongPressDelay: 50,
		themeSystem: 'standard',
		select: async selectionInfo => {
			this.selectedDate = selectionInfo.startStr;
			const allTasks =
				await this._taskSelectionService.getTasksFromFamillyGroup();
			this.tasksForSelectedDate = allTasks.filter(
				task => task.dueDate === this.selectedDate,
			);
		},
	};

	public backToHome() {
		this._router.navigate(['/chore-homepage']);
	}
}
