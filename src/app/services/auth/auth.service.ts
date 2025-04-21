import { Injectable } from '@angular/core';
import {
	Auth,
	AuthErrorCodes,
	createUserWithEmailAndPassword,
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
	public user?: User;

	constructor(private readonly _auth: Auth) {
		onAuthStateChanged(this._auth, user => {
			if (user) {
				this.user = user;
				console.log('User state changed:', user);
			}
		});
	}

	public getUserId() {
		if (this.user) {
			return this.user.uid;
		} else {
			return 'No user ID found';
		}
	}

	public getUserEmail() {
		if (this.user) {
			return this.user.email;
		} else {
			return 'No user email found';
		}
	}

	public anonymousSignIn() {
		return signInAnonymously(this._auth);
	}

	public signUp(email: string, password: string) {
		return createUserWithEmailAndPassword(this._auth, email, password);
	}

	public signIn(email: string, password: string) {
		return signInWithEmailAndPassword(this._auth, email, password);
	}

	public signOut() {
		return signOut(this._auth);
	}
}
