import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
	Auth,
	AuthErrorCodes,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	User,
	sendPasswordResetEmail,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

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

	public _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
	public user$ = this._user$.asObservable();

	constructor(private readonly _auth: Auth) {
		onAuthStateChanged(this._auth, user => {
			this.user = user;
			this._user$.next(user);
		});
	}

	// public anonymousSignIn() {
	// 	return signInAnonymously(this._auth);
	// }

	public async signUp(email: string, password: string): Promise<User> {
		try {
			const userCredential = await createUserWithEmailAndPassword(this._auth, email, password);
			this.user = userCredential.user;
			this._user$.next(this.user);
			return this.user;
		} catch (error) {
			if (error instanceof FirebaseError) {
				switch (error.code) {
					case AuthErrorCodes.EMAIL_EXISTS:
						console.error('Email exists already in the system.');
						break;
					case AuthErrorCodes.INVALID_PASSWORD:
						console.error('Invalid password. Please provide a valid password.');
						break;
					default:
						console.error('An unexpected error occurred:', error.message);
				}
			}
			throw error;
		}
	}

	public async signIn(email: string, password: string): Promise<User> {
		try {
			const userCredential = await signInWithEmailAndPassword(this._auth, email, password);
			this.user = userCredential.user;
			this._user$.next(this.user);
			return this.user;
		} catch (error) {
			if (error instanceof FirebaseError) {
				switch (error.code) {
					case AuthErrorCodes.INVALID_PASSWORD:
						console.error('Password is invalid. Please check your password.');
						break;
					case AuthErrorCodes.INVALID_EMAIL:
						console.error('Email is invalid. Please check your email');
						break;
					case AuthErrorCodes.CREDENTIAL_MISMATCH:
						console.error('Your credentials do not match. Please check your email and password.');
						break;
					default:
						console.error('An unexpected error occurred:', error.message);
				}
			}
			throw error;
		}
	}

	public async signOut() {
		await signOut(this._auth);
		this.user = null;
		this._user$.next(this.user);
		console.log('User signed out successfully');
	}

	public sendPasswordResetEmail(email: string) {
		return sendPasswordResetEmail(this._auth, email);
	}
}
