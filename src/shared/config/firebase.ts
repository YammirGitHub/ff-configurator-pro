// src/shared/config/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// 👇 IMPORTAMOS EL MOTOR DE CACHÉ OFFLINE
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

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
export const googleProvider = new GoogleAuthProvider();

// 🔥 MAGIA PWA: Habilitamos la Caché Offline Persistente
// Ahora tu app cargará los datos en 0 milisegundos directamente del disco del celular
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
