
import { initializeApp } from "firebase/app";

import { getAuth,onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { getFirestore } from 'firebase/firestore'; // Import Firestore module

const firebaseConfig = {
  apiKey: "AIzaSyDN2wFa6C6SO_HXPUrctp3xI1hfZVlIwwM",
  authDomain: "blogging-app-42acf.firebaseapp.com",
  projectId: "blogging-app-42acf",
  storageBucket: "blogging-app-42acf.appspot.com",
  messagingSenderId: "1026179222102",
  appId: "1:1026179222102:web:92d953f9174cf0855549f7",
  measurementId: "G-KQL3M6Z7DB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database

const auth = getAuth(app);
export { auth,db, onAuthStateChanged ,createUserWithEmailAndPassword, signInWithEmailAndPassword };

