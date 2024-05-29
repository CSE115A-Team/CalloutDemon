// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export class MapStorage {

    constructor() {
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDgFO86XXDuvyFrSPSmCA8YC8XcucAsVYw",
            authDomain: "callout-demon.firebaseapp.com",
            projectId: "callout-demon",
            storageBucket: "callout-demon.appspot.com",
            messagingSenderId: "968725959431",
            appId: "1:968725959431:web:40696e16e53bf0f25deba2",
            measurementId: "G-SSS8LJWJVR"
        };

        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
    }

    // Returns json containing all map data for a specific uuid
    getMapDataByUUID(map, uuid) {
        const docRef = doc(this.db, 'users', uuid);

        // Promise for async calls
        return getDoc(docRef)
        .then((doc) => {
            if (doc.exists) {
                return JSON.parse(doc.data()[map]);
            } else {
                throw new error("No such document");
            }
        })
        .catch((error) => {
            console.error('Error getting document:', error);
            throw error;
        });
    }

    // Sets map data at a certain UUID
    setMapDataByUUID(map, data, uuid) {
        const docRef = doc(this.db, 'users', uuid);

        // Promise for async calls
        return setDoc(docRef, {
            [map]: JSON.stringify(data)
          }, { merge: true });
    }
}