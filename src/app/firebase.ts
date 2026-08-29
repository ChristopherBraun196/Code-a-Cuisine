import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

const firebaseApp = initializeApp(environment.firebase);

export const database = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);
