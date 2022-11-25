import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyCpuQl2p1sHUB1Y5zKKVPgr1K6ja1kGws8",
    authDomain: "vinabro-e496c.firebaseapp.com",
    projectId: "vinabro-e496c",
    storageBucket: "vinabro-e496c.appspot.com",
    messagingSenderId: "286747038226",
    appId: "1:286747038226:web:4d031ee89ee246d2b07ecb",
    measurementId: "G-7HDTXTSH0V",
};
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);
