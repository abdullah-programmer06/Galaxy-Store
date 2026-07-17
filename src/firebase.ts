import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  enableMultiTabIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

// Re-export Auth Providers for ease of use
export {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
};

const firebaseConfig = {
  apiKey: "AIzaSyCgTlYD-HrRGbw7moSTodYxsKgx-X5er2k",
  authDomain: "galaxy-store-2cd1a.firebaseapp.com",
  databaseURL: "https://galaxy-store-2cd1a-default-rtdb.firebaseio.com",
  projectId: "galaxy-store-2cd1a",
  storageBucket: "galaxy-store-2cd1a.firebasestorage.app",
  messagingSenderId: "971159731728",
  appId: "1:971159731728:web:336422f9d155b0f9281495",
};

export const app = initializeApp(firebaseConfig);

let firebaseAuth: any;
try {
  // Use initializeAuth to supply multiple persistence layers so it gracefully degrades inside sandboxed iframes
  firebaseAuth = initializeAuth(app, {
    persistence: [
      browserLocalPersistence,
      browserSessionPersistence,
      inMemoryPersistence,
    ],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
} catch (e) {
  // Fall back to standard getAuth if already initialized or if there's an unsupported platform issue
  firebaseAuth = getAuth(app);
}

export const auth = firebaseAuth;
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
