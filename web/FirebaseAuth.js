import app from './FirebaseAppConnection.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let user;

onAuthStateChanged(auth, (currentUser) => {
    user = currentUser
    if(user) {
        signOutButton.style.display = "block";
        message.style.display = "block";
        userName.innerHTML = user.displayName;
        userEmail.innerHTML = user.email
    } else {
        signOutButton.style.display = "none";
        message.style.display = "none";
    }
});

export function signInUser() {
    signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    }).catch((error) => {
        console.error("Error signing in:", error);
    });
}

export function signOutUser() {
    signOut(auth).then(() => {
        alert("You have signed out successfully!");
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}

export function getUserUUID() {
    if (user) {
        return user.uid;
    }
    return "";
}




// const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");


signOutButton.style.display = "none";
message.style.display = "none";
