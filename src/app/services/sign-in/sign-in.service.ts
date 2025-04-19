import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';

/*
This service is responsible for managing the sign-in process.
There is an anonymous sign-in and a sign-in with email and password.
The service will be injected in the login page component.
*/

@Injectable({
	providedIn: 'root',
})
export class SignInService {
	public user?: User;

	constructor(private readonly _auth: Auth) {}

	async signUpWithEmailAndPassword(email: string, password: string) {
		const result = await createUserWithEmailAndPassword(this._auth, email, password);
		this.user = result.user;
	}
}
