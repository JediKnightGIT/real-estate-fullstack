import dotenv from 'dotenv';
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from "../private-key.json";

dotenv.config();

const serviceAccountCredentials = serviceAccount as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountCredentials),
});

export default admin;