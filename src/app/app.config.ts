import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "homeflow-cce5c", appId: "1:481811143395:web:2ef8db79276075bb2bc3d6", storageBucket: "homeflow-cce5c.firebasestorage.app", apiKey: "AIzaSyDF4H-EfCAc6MQM7LsncLvWepnqVSkBK4I", authDomain: "homeflow-cce5c.firebaseapp.com", messagingSenderId: "481811143395" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
};
