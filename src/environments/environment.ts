export const environment = {
  production: true,
  // TODO: auf vServer-URL umstellen, sobald n8n dort gehostet wird
  n8nWebhookUrl: 'http://localhost:5678/webhook/generate-recipes',
  firebase: {
    apiKey: 'AIzaSyA0vRKPX9fvT0ffODB0iHoQG8kl6R-kBa0',
    authDomain: 'code-a-cuisine-4338d.firebaseapp.com',
    databaseURL: 'https://code-a-cuisine-4338d-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'code-a-cuisine-4338d',
    storageBucket: 'code-a-cuisine-4338d.firebasestorage.app',
    messagingSenderId: '572354672594',
    appId: '1:572354672594:web:63b33a4c4cfb7f00f03a0b',
  },
};
