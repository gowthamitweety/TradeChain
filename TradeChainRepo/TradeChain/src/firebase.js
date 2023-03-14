import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHT_98smN1JX4UBGRhp__4uOHruGFwpWs",
  authDomain: "solana-tradechain.firebaseapp.com",
  projectId: "solana-tradechain",
  storageBucket: "solana-tradechain.appspot.com",
  messagingSenderId: "302628963113",
  appId: "1:302628963113:web:958be704a9162a1b69ed38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// Initialize Cloud Firestore and get a reference to the service
