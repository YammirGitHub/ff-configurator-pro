// src/shared/config/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjfYvrBR_l2bdl2W0Va82yn9W70sx1cKc",
  authDomain: "ff-auth-system-d6a58.firebaseapp.com",
  projectId: "ff-auth-system-d6a58",
  storageBucket: "ff-auth-system-d6a58.firebasestorage.app",
  messagingSenderId: "684184867168",
  appId: "1:684184867168:web:759130b0113509cd904e05",
  measurementId: "G-KFH5RHHCSH",
};

// Patrón Singleton: Evita que Next.js inicialice Firebase múltiples veces
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
