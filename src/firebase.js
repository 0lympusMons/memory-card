// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// console.log(process.env.REACT_APP_API_KEY);
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_API_KEY,
  authDomain: "memory-card-268b4.firebaseapp.com",
  projectId: "memory-card-268b4",
  storageBucket: "memory-card-268b4.appspot.com",
  messagingSenderId: "800751272320",
  appId: "1:800751272320:web:f98bcd73c14aaa813c4165",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const userCollection = collection(firestore, "/users");

// Authenticate with Firebase
const auth = getAuth(app);

export async function handleGoogle(e) {
  const provider = await new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function handleSignOut() {
  signOut(auth)
    .then(() => {
      console.log("Sign out successfully");
    })
    .catch((error) => {
      throw error;
    });
}
