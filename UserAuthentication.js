import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgFO86XXDuvyFrSPSmCA8YC8XcucAsVYw",
    authDomain: "callout-demon.firebaseapp.com",
    projectId: "callout-demon",
    storageBucket: "callout-demon.appspot.com",
    messagingSenderId: "968725959431",
    appId: "1:968725959431:web:40696e16e53bf0f25deba2",
    measurementId: "G-SSS8LJWJVR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider()

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

signOutButton.style.display = "none";
message.style.display = "none";

const userSignIn = async() => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user
        console.log(user);
        console.log(user.uid);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message
        console.log("S")
    });
}

function getUserUUID() {
    return user.uid;
}

const userSignOut = async() => {
console.log(getUserUUID());
signOut(auth).then(() => {
    alert("You have signed out successfully!");
}).catch((error) => {});
}

onAuthStateChanged(auth, (user) => {
if(user) {
    signOutButton.style.display = "block";
    message.style.display = "block";
    userName.innerHTML = user.displayName;
    userEmail.innerHTML = user.email
} else {
    signOutButton.style.display = "none";
    message.style.display = "none";
}
})

signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);