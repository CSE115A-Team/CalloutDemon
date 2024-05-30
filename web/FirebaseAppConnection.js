import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgFO86XXDuvyFrSPSmCA8YC8XcucAsVYw",
    authDomain: "callout-demon.firebaseapp.com",
    projectId: "callout-demon",
    storageBucket: "callout-demon.appspot.com",
    messagingSenderId: "968725959431",
    appId: "1:968725959431:web:40696e16e53bf0f25deba2",
    measurementId: "G-SSS8LJWJVR"
};

export class FirebaseAppConnection {
    constructor() {
        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);
    }

    getApp() {
        return this.app
    }
}