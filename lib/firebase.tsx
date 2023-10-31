import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8K1NLeV_laL7q1VJ89TQwbB5LHajhEw8",
  authDomain: "grippy-app-c89b1.firebaseapp.com",
  projectId: "grippy-app-c89b1",
  storageBucket: "grippy-app-c89b1.appspot.com",
  messagingSenderId: "107688280818",
  appId: "1:107688280818:web:2b914dc66a49cf1ac3c66b",
  measurementId: "G-D4SNT9P0KZ",
};

const app = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app); // Initialize Firestore

export { auth, db };
