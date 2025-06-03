export interface Categories {
	uuid: string;
	title: string;
	icon: string;
}

export interface Tasks {
	uuid: string;
	icon: string;
	description: string;
	score: number;
	dueDate: string;
	frequency: string;
	assignee: string;
	validated: boolean;
	categoryUuid: string;
}
