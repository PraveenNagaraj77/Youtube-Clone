// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth , GoogleAuthProvider} from "firebase/auth";
import { getFirestore,serverTimestamp} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNPK2sWZOj_hihgZyeMMuR-AS51FMPGB4",
  authDomain: "clone-38c6a.firebaseapp.com",
  projectId: "clone-38c6a",
  storageBucket: "clone-38c6a.appspot.com",
  messagingSenderId: "563800643847",
  appId: "1:563800643847:web:9a9f71ee4b17a7932e8da2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
const timestamp = serverTimestamp();


export {app,db,auth,provider,timestamp};