// Firebase-Konfiguration und Initialisierung
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Trage hier deine Firebase-Konfigurationsdaten ein
const firebaseConfig = {
  apiKey: "AIzaSyCvcGbakdW0kmy6RZdxWoMhD8Et5ELArkI",
  authDomain: "nova-53eb8.firebaseapp.com",
  projectId: "nova-53eb8",
  storageBucket: "nova-53eb8.firebasestorage.app",
  messagingSenderId: "467250745617",
  appId: "1:467250745617:web:0bb3c5fda4897020e0bcb0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
