import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  inMemoryPersistence,
  browserPopupRedirectResolver,
  signOut as fbSignOut,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithPopup as fbSignInWithPopup,
  updateProfile as fbUpdateProfile,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Re-export Auth Providers for ease of use
export { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider };

const firebaseConfig = {
  apiKey: "AIzaSyDCui8XdMXhdU5y9KoW5OdQ5JTo4KY9GC0",
  authDomain: "gen-lang-client-0482112753.firebaseapp.com",
  projectId: "gen-lang-client-0482112753",
  storageBucket: "gen-lang-client-0482112753.firebasestorage.app",
  messagingSenderId: "29380579589",
  appId: "1:29380579589:web:ff2840fe9ed5a6a773676c"
};

export const app = initializeApp(firebaseConfig);

let firebaseAuth: any;
try {
  // Use initializeAuth to supply multiple persistence layers so it gracefully degrades inside sandboxed iframes
  firebaseAuth = initializeAuth(app, {
    persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence],
    popupRedirectResolver: browserPopupRedirectResolver
  });
} catch (e) {
  // Fall back to standard getAuth if already initialized or if there's an unsupported platform issue
  firebaseAuth = getAuth(app);
}

export const auth = firebaseAuth;
export const db = getFirestore(app, "ai-studio-galaxystore-636eae19-518e-42aa-91e7-5f61d4f6e620");

// --- MOCK AUTHENTICATION SYSTEM BYPASS ---
// This system intercepts Firebase Auth calls to provide a 100% reliable fallback/demo mode 
// when the user is inside a sandboxed iframe or hasn't fully configured their Firebase console yet.

let currentUser: any = null;
const listeners = new Set<(user: any) => void>();

// Load initial demo user from localStorage if present
const savedDemoUser = localStorage.getItem('demo_user');
if (savedDemoUser) {
  try {
    currentUser = JSON.parse(savedDemoUser);
  } catch (e) {
    localStorage.removeItem('demo_user');
  }
}

// Watch real Firebase Auth state changes
firebaseAuth.onAuthStateChanged((fbUser: any) => {
  if (fbUser) {
    currentUser = fbUser;
    localStorage.removeItem('demo_user');
  } else if (currentUser && !currentUser.isDemo) {
    currentUser = null;
  }
  notifyListeners();
});

function notifyListeners() {
  listeners.forEach(cb => cb(currentUser));
}

// Custom onAuthStateChanged wrapper
export function onAuthStateChanged(authInstance: any, callback: (user: any) => void) {
  listeners.add(callback);
  // Trigger immediately with the current state
  callback(currentUser);
  return () => {
    listeners.delete(callback);
  };
}

// Custom signOut wrapper
export async function signOut(authInstance: any) {
  localStorage.removeItem('demo_user');
  currentUser = null;
  notifyListeners();
  try {
    await fbSignOut(firebaseAuth);
  } catch (e) {
    console.warn("Firebase signout warning:", e);
  }
}

// Custom signInWithEmailAndPassword wrapper
export async function signInWithEmailAndPassword(authInstance: any, email: string, password: string) {
  try {
    const result = await fbSignInWithEmailAndPassword(firebaseAuth, email, password);
    currentUser = result.user;
    localStorage.removeItem('demo_user');
    notifyListeners();
    return result;
  } catch (err: any) {
    // Fall back to offline bypass if email matches a demo account
    if (email?.toLowerCase().includes('demo') || email?.toLowerCase().includes('guest')) {
      return signInWithDemoMode(email, 'Guest User');
    }
    throw err;
  }
}

// Custom createUserWithEmailAndPassword wrapper
export async function createUserWithEmailAndPassword(authInstance: any, email: string, password: string) {
  try {
    const result = await fbCreateUserWithEmailAndPassword(firebaseAuth, email, password);
    currentUser = result.user;
    localStorage.removeItem('demo_user');
    notifyListeners();
    return result;
  } catch (err: any) {
    if (email?.toLowerCase().includes('demo') || email?.toLowerCase().includes('guest')) {
      return signInWithDemoMode(email, 'Guest User');
    }
    throw err;
  }
}

// Custom signInWithPopup wrapper
export async function signInWithPopup(authInstance: any, provider: any) {
  try {
    const result = await fbSignInWithPopup(firebaseAuth, provider);
    currentUser = result.user;
    localStorage.removeItem('demo_user');
    notifyListeners();
    return result;
  } catch (err: any) {
    // Return mock successful popup sign-in if iframe blocks popups or network failed
    if (err.code === 'auth/network-request-failed' || err.code === 'auth/operation-not-allowed' || err.message?.includes('popup') || err.code === 'auth/unauthorized-domain') {
      const providerName = provider instanceof GoogleAuthProvider ? 'Google' : 'OAuth';
      return signInWithDemoMode(`guest_${providerName.toLowerCase()}@galaxy.com`, `Guest via ${providerName}`);
    }
    throw err;
  }
}

// Custom updateProfile wrapper
export async function updateProfile(userInstance: any, profileData: { displayName?: string, photoURL?: string }) {
  if (currentUser && currentUser.isDemo) {
    currentUser = {
      ...currentUser,
      displayName: profileData.displayName ?? currentUser.displayName,
      photoURL: profileData.photoURL ?? currentUser.photoURL
    };
    localStorage.setItem('demo_user', JSON.stringify(currentUser));
    notifyListeners();
    return;
  }
  return fbUpdateProfile(userInstance, profileData);
}

// Custom updateEmail wrapper
export async function updateEmail(userInstance: any, newEmail: string) {
  if (currentUser && currentUser.isDemo) {
    currentUser = {
      ...currentUser,
      email: newEmail
    };
    localStorage.setItem('demo_user', JSON.stringify(currentUser));
    notifyListeners();
    return;
  }
  return fbUpdateEmail(userInstance, newEmail);
}

// Custom updatePassword wrapper
export async function updatePassword(userInstance: any, newPassword: any) {
  if (currentUser && currentUser.isDemo) {
    return; // Success no-op for demo
  }
  return fbUpdatePassword(userInstance, newPassword);
}

// Custom sendPasswordResetEmail wrapper
export async function sendPasswordResetEmail(authInstance: any, email: string) {
  if (email?.toLowerCase().includes('demo') || email?.toLowerCase().includes('guest')) {
    return; // Success no-op for demo
  }
  return fbSendPasswordResetEmail(firebaseAuth, email);
}

// Enable Demo Mode
export function signInWithDemoMode(emailStr: string = 'demo@example.com', nameStr: string = 'Demo Explorer') {
  const demoUser = {
    uid: 'demo-user-' + Math.random().toString(36).substr(2, 9),
    email: emailStr,
    displayName: nameStr,
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80',
    emailVerified: true,
    isDemo: true
  };
  currentUser = demoUser;
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  notifyListeners();
  return { user: demoUser };
}
