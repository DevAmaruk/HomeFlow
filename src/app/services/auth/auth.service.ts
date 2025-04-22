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
	public user: User | undefined;

	constructor(private readonly _auth: Auth) {
		onAuthStateChanged(this._auth, user => {
			if (user) {
				this.user = user;
			} else {
				this.user = undefined;
			}
		});
	}

	public getCurrentUser() {
		const user = this._auth.currentUser;
		if (user) {
			this.user = user;
			return user;
		} else {
			return null;
		}
	}

	// public anonymousSignIn() {
	// 	return signInAnonymously(this._auth);
	// }

	public async signUp(email: string, password: string): Promise<User> {
		try {
			const userCredential = await createUserWithEmailAndPassword(this._auth, email, password);
			this.user = userCredential.user;
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
		this.user = undefined;
		console.log('User signed out successfully');
	}
}
