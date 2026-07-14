import { initializeApp } from "firebase/app";
import { initializeAuth, signInWithPopup, GoogleAuthProvider, browserPopupRedirectResolver } from "firebase/auth";
console.log(browserPopupRedirectResolver ? 'exists' : 'not exists');
