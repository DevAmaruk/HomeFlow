export interface Category {
	uuid: string;
	title: string;
	icon: string;
	tasks: Task[];
}

export interface Task {
	uuid: string;
	icon: string;
	description: string;
	score: number;
	dueDate: string;
	frequency: string;
	assignee: string;
	validated: boolean;
}
