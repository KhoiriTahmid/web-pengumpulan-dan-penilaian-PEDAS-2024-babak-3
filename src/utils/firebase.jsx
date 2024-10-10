// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig1 = {
  apiKey: import.meta.env.apikey1,
  authDomain: "penilaian-pedas-babak3.firebaseapp.com",
  projectId: "penilaian-pedas-babak3",
  storageBucket: "penilaian-pedas-babak3.appspot.com",
  messagingSenderId: "564825886314",
  appId: "1:564825886314:web:34225a3527307435c90413",
};

// Initialize Firebase
const app1 = initializeApp(firebaseConfig1, "app1");
export const db1 = getFirestore(app1);

const firebaseConfig2 = {
  apiKey: import.meta.env.apikey2,
  authDomain: "penilaian-pedas-babak3-part2.firebaseapp.com",
  projectId: "penilaian-pedas-babak3-part2",
  storageBucket: "penilaian-pedas-babak3-part2.appspot.com",
  messagingSenderId: "491939742843",
  appId: "1:491939742843:web:56823bd8a73ba663a44ede",
};

// Initialize Firebase
const app2 = initializeApp(firebaseConfig2, "app2");
export const db2 = getFirestore(app2);
export const storage = getStorage(app2);
