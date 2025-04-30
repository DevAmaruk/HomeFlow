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
	authState,
	updateProfile,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
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
	public username?: string;

	public _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
	public user$;
	constructor(private readonly _auth: Auth, private readonly _firestore: Firestore) {
		this.user$ = authState(this._auth);
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

	public async updateUserProfile(profile: { displayName?: string }) {
		if (this._auth.currentUser) {
			await updateProfile(this._auth.currentUser, profile);
		} else {
			throw new Error('No authenticated user to update profile.');
		}
	}

	public async getUserData(): Promise<{ username: string } | null> {
		const currentUser = this._auth.currentUser;
		if (!currentUser) {
			return null;
		}

		const userDocRef = doc(this._firestore, 'Users', currentUser.uid);
		const userDoc = await getDoc(userDocRef);

		if (userDoc.exists()) {
			return userDoc.data() as { username: string };
		} else {
			console.error('User document does not exist in Firestore');
			return null;
		}
	}
}
