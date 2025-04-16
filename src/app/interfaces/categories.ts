export interface Categories {
	uuid: string;
	title: string;
	icon: string;
	tasks: Task[];
}

export interface Task {
	uuid: string;
	icon: string;
	description: string;
}
