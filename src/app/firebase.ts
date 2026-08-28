import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { environment } from '../environments/environment';

const firebaseApp = initializeApp(environment.firebase);

export const database = getDatabase(firebaseApp);
