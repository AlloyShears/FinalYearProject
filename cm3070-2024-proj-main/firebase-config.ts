import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

// Optionally import the services that you want to use
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD9rgCkkJMZsHXfaneLIMdSfMieH0Eusgw",
  authDomain: "doeh-35bf9.firebaseapp.com",
  projectId: "doeh-35bf9",
  storageBucket: "doeh-35bf9.appspot.com",
  messagingSenderId: "108565108337",
  appId: "1:108565108337:web:dabe80e81b445103f96dd0",
  measurementId: "G-KH5JGZZ5JN",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
