import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

const firebaseApp = initializeApp(environment.firebase);

/** Reference to the application's Firebase Realtime Database. */
export const database = getDatabase(firebaseApp);
/** Firebase Auth instance, used for anonymous sign-in (reads are public, writes require auth). */
export const auth = getAuth(firebaseApp);
