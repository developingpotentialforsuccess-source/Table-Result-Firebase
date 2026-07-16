import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const isFirebaseConfigured = () => {
  return firebaseConfig && 
         firebaseConfig.projectId !== 'remixed-project-id' && 
         firebaseConfig.apiKey !== 'remixed-api-key' &&
         firebaseConfig.apiKey !== '';
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection on boot if configured
if (isFirebaseConfigured()) {
  const testConnection = async () => {
    try {
      // Use a dummy path to test connectivity
      await getDocFromServer(doc(db, '_connection_test_', 'init'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Firebase connection failed: Client is offline. Please check your configuration.");
      } else {
        // It's okay if the document doesn't exist, we just want to know if we can reach the server
        console.log("Firebase connection test performed.");
      }
    }
  };
  testConnection();
}
