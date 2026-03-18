const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';

// On crée le contenu du fichier DIRECTEMENT avec les vraies valeurs
const envConfigFile = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY || ""}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN || ""}',
    projectId: '${process.env.FIREBASE_PROJECT_ID || ""}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET || ""}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID || ""}',
    appId: '${process.env.FIREBASE_APP_ID || ""}'
  }
};
`;

console.log("Injecting environment variables...");
fs.writeFileSync(targetPath, envConfigFile);
console.log(`File generated at ${targetPath}`);