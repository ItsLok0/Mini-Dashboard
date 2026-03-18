const fs = require('fs');
const envFile = `./src/environments/environment.ts`;
let content = fs.readFileSync(envFile, 'utf8');

// On remplace les placeholders par les vraies variables de Vercel
content = content.replace('process.env.FIREBASE_API_KEY', process.env.FIREBASE_API_KEY);
content = content.replace('process.env.FIREBASE_AUTH_DOMAIN', process.env.FIREBASE_AUTH_DOMAIN);
content = content.replace('process.env.FIREBASE_PROJECT_ID', process.env.FIREBASE_PROJECT_ID);
content = content.replace('process.env.FIREBASE_STORAGE_BUCKET', process.env.FIREBASE_STORAGE_BUCKET);
content = content.replace('process.env.FIREBASE_MESSAGING_SENDER_ID', process.env.FIREBASE_MESSAGING_SENDER_ID);
content = content.replace('process.env.FIREBASE_APP_ID', process.env.FIREBASE_APP_ID);

fs.writeFileSync(envFile, content);