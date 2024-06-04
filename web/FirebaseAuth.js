import app from './FirebaseAppConnection.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let user;

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

signOutButton.style.display = "none";
message.style.display = "none";

onAuthStateChanged(auth, (currentUser) => {
    user = currentUser;
    if (user) {
        signInButton.style.display = "none";
        signOutButton.style.display = "block";
        message.style.display = "block";
        userName.innerHTML = user.displayName;
        userEmail.innerHTML = user.email;
    } else {
        signInButton.style.display = "block";
        signOutButton.style.display = "none";
        message.style.display = "none";
    }
});

export function signInUser() {
    signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user;
            updateSignInStatus();
        }).catch((error) => {
            console.error("Error signing in:", error);
        });
}

export function signOutUser() {
    signOut(auth).then(() => {
        alert("You have signed out successfully!");
        updateSignInStatus();
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

function updateSignInStatus() {
    if (user) {
        signInButton.style.display = "none";
        signOutButton.style.display = "block";
        message.style.display = "block";
        userName.innerHTML = user.displayName;
        userEmail.innerHTML = user.email;
    } else {
        signInButton.style.display = "block";
        signOutButton.style.display = "none";
        message.style.display = "none";
    }
}
