// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDYtmt78hEvIR_5ZuszMLZIPMEZZvJRT08",
  authDomain: "aysippop.firebaseapp.com",
  projectId: "aysippop",
  storageBucket: "aysippop.firebasestorage.app",
  messagingSenderId: "799983114795",
  appId: "1:799983114795:android:d54820264e67f7fd50a86e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
