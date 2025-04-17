import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../interfaces/categories';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';

/*
This service will create a FormArray with the tasks selected by the user.
It will be injected in the homepage.
*/

@Injectable({
	providedIn: 'root',
})
export class TaskSelectionService {
	// We create a FormArray with no values at the beginning
	public taskArray = new FormArray([] as any);

	addTask(task: Task) {
		this.taskArray.push(task);
	}

	getTasks(): Task[] {
		return this.taskArray.value;
	}
}
