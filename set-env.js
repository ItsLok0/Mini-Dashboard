const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, './src/environments/environment.prod.ts');

const envConfigFile = `export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.NG_APP_FIREBASE_API_KEY || ""}',
    authDomain: '${process.env.NG_APP_FIREBASE_AUTH_DOMAIN || ""}',
    projectId: '${process.env.NG_APP_FIREBASE_PROJECT_ID || ""}',
    storageBucket: '${process.env.NG_APP_FIREBASE_STORAGE_BUCKET || ""}',
    messagingSenderId: '${process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID || ""}',
    appId: '${process.env.NG_APP_FIREBASE_APP_ID || ""}'
  }
};
`;

console.log('--- Generation du fichier environment.prod.ts ---');
fs.writeFileSync(targetPath, envConfigFile);
console.log('--- Variables injectées avec succès ---');