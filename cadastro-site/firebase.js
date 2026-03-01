import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvbQLp9-qbBlbmqCDYaUQINp7XQiynYQg",
  authDomain: "agilize-2026.firebaseapp.com",
  projectId: "agilize-2026",
  storageBucket: "agilize-2026.firebasestorage.app",
  messagingSenderId: "105073351239",
  appId: "1:105073351239:web:8ea81af61735d9f9026f62"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase novo conectado com sucesso");