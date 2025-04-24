import { Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { FamillyService } from '../famillyService/familly.service';
import { Task } from '../../interfaces/categories';

/*
This service is used to add a custom task to the user database.
*/

@Injectable({
	providedIn: 'root',
})
export class CustomTaskCreationService {
	public userObs: Observable<User | null>;
	public user: User | null = null;

	constructor(
		private readonly _firestore: Firestore,
		private readonly _authService: AuthService,
		private readonly _famillyService: FamillyService,
	) {
		this.userObs = this._authService.user$;
	}

	private async addDefaultCustomTask(userDatabaseRef: CollectionReference) {
		const defaultCustomTaskRef = doc(userDatabaseRef);
		await setDoc(defaultCustomTaskRef, {
			createdAt: new Date(), // Set the creation date of the task
		});
	}

	//This method is used to add a custom task to the user database collection in Firestore.
	public async addCustomTaskToUserDatabase(task: Task) {
		try {
			const famillyGroupName = await this._famillyService.getFamillyGroupName();

			if (!famillyGroupName) {
				throw new Error('Familly group name is not set. Please set it before adding tasks.');
			}

			const userDatabaseCol = collection(this._firestore, 'Familly', famillyGroupName, 'UserDatabase');
			await addDoc(userDatabaseCol, task);
		} catch (error) {
			console.error('Error adding custom task to user database:', error);
			throw new Error('Failed to add custom task. Please try again later.');
		}
	}

	public async addCustomCategoryToDatabase(category: { uuid: string; title: string; icon: string }) {
		try {
			const famillyGroupName = await this._famillyService.getFamillyGroupName();

			if (!famillyGroupName) {
				throw new Error('Familly group name is not set. Please set it before adding tasks.');
			}
			const categoriesColRef = collection(this._firestore, 'Familly', famillyGroupName, 'Categories');
			await addDoc(categoriesColRef, category);
			console.log('Category added successfully:', category);
		} catch (error) {
			console.error('Error adding category to database:', error);
			throw new Error('Failed to add category. Please try again later.');
		}
	}
}
