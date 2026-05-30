import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzNlvDdEIm99xry_N1Aa37NViRO9uUfxM",
  authDomain: "casetoo-20fb3.firebaseapp.com",
  projectId: "casetoo-20fb3",
  storageBucket: "casetoo-20fb3.firebasestorage.app",
  messagingSenderId: "342499330422",
  appId: "1:342499330422:web:49879acee41c5851975257",
  measurementId: "G-T7LR2HNVJS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
