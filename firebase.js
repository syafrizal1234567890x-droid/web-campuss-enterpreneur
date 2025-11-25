// public/js/firebase.js - Import dari CDN

// Import Firebase dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZZQmOzLGyKuAm4mOuZ0uVH7F8jqnAyKE",
  authDomain: "web-campuss-enterpreneur.firebaseapp.com",
  projectId: "web-campuss-enterpreneur",
  storageBucket: "web-campuss-enterpreneur.firebasestorage.app",
  messagingSenderId: "1003124895294",
  appId: "1:1003124895294:web:a44067b0f23974f1f7ab6f",
  measurementId: "G-LP229SQEN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export the services for use in other files
export { app, analytics, db, auth, storage };