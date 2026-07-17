import { initializeApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromCache, getDocFromServer, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const isFirebaseConfigured = () => {
  return firebaseConfig && 
         firebaseConfig.projectId !== 'remixed-project-id' && 
         firebaseConfig.apiKey !== 'remixed-api-key' &&
         firebaseConfig.apiKey !== '';
};

const app = initializeApp(firebaseConfig);

let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    ignoreUndefinedProperties: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (cacheError) {
  console.warn("Failed to initialize Firestore with persistent local cache, falling back to default:", cacheError);
  try {
    firestoreDb = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });
  } catch (fallbackError) {
    console.error("Failed to initialize Firestore even with default options, using getFirestore:", fallbackError);
    firestoreDb = getFirestore(app);
  }
}

export const db = firestoreDb;
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
