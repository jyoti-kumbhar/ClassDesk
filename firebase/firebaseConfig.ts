// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR4T9AomkgJ-nGwkukNYZJDrSo_kR1ImU",
  authDomain: "exam-attendance-app-5e459.firebaseapp.com",
  projectId: "exam-attendance-app-5e459",
  storageBucket: "exam-attendance-app-5e459.firebasestorage.app",
  messagingSenderId: "1072135191552",
  appId: "1:1072135191552:web:92fa49f318ad1d51af2ce5",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);