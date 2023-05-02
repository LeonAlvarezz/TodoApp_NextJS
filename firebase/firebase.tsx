// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMux8JLk9ycSq6GCGroBdXFY5_hpejppA",
  authDomain: "todos-c5fd3.firebaseapp.com",
  projectId: "todos-c5fd3",
  storageBucket: "todos-c5fd3.appspot.com",
  messagingSenderId: "1020948290598",
  appId: "1:1020948290598:web:db58c59522b3b1542e9ae7",
  measurementId: "G-3GQC8XEZ45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
