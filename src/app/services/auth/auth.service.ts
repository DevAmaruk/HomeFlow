import { Injectable } from '@angular/core';
import {
	Auth,
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signInAnonymously,
	signInWithEmailAndPassword,
	signOut,
	User,
} from '@angular/fire/auth';

/*
This service will handle the authentication of the user.
It will be injected in the login page.
It will use the firebase authentication module to authenticate the user.
*/

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public user?: User | null;

	constructor(private readonly _auth: Auth) {
		onAuthStateChanged(this._auth, user => {
			this.user = user;
			console.log('User state changed:', user);
		});
	}

	public anonymousSignIn() {
		return signInAnonymously(this._auth);
	}

	public signUp(email: string, password: string) {
		try {
			return createUserWithEmailAndPassword(this._auth, email, password);
		} catch (error: any) {
			switch (error.code) {
				case 'auth/email-already-in-use':
					console.error('Email already in use. Please use a different email address.');
					break;
				default:
					console.error('An unknown error occurred. Please try again later.');
			}
			throw error;
		}
	}

	public signIn(email: string, password: string) {
		try {
			return signInWithEmailAndPassword(this._auth, email, password);
		} catch (error: any) {
			switch (error.code) {
				case 'auth/invalid-email':
					console.error('Invalid email address. Please enter a valid email address.');
					break;
				case 'auth/wrong-password':
					console.error('Wrong password. Please enter the correct password.');
					break;
				default:
					console.error('An unknown error occurred. Please try again later.');
			}
			throw error;
		}
	}

	public signOut() {
		return signOut(this._auth);
	}
}
