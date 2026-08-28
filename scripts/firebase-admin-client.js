const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require('./serviceAccountKey.json');

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://code-a-cuisine-4338d-default-rtdb.europe-west1.firebasedatabase.app',
});

const db = getDatabase(app);

module.exports = { db };
