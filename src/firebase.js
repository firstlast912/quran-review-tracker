// firebase.js - Firebase configuration and services
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAc-F0WOdit_7zpKRCyHOBQZUifwmZmqJQ",
  authDomain: "quran-review-tracker.firebaseapp.com",
  projectId: "quran-review-tracker",
  storageBucket: "quran-review-tracker.firebasestorage.app",
  messagingSenderId: "74411369960",
  appId: "1:74411369960:web:d0036f4898b7ca3799705d",
  measurementId: "G-CPQM9ZPSXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Data management functions
export const saveUserData = async (userId, data) => {
  try {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, {
      ...data,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

// Real-time listener for user data
export const subscribeToUserData = (userId, callback) => {
  const userDoc = doc(db, 'users', userId);
  return onSnapshot(userDoc, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export { auth, db };