// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgZpA5tLhLWH5j2uB0upvRm8I-Y-3aqcs",
  authDomain: "petcheckon-vue3-03523618-b08cd.web.app",
  projectId: "petcheckon-vue3-03523618-b08cd",
  storageBucket: "petcheckon-vue3-03523618-b08cd.appspot.com",
  messagingSenderId: "111028503876",
  appId: "1:111028503876:web:214d876a9bee633c80c311",
  measurementId: "G-ZCLF591ZW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
