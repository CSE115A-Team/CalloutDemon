// Import the functions you need from the SDKs you need
import app from './FirebaseAppConnection.js';
import { getFirestore, doc, getDoc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export class MapStorage {

    constructor() {
        this.db = getFirestore(app);
    }

    // Returns json containing all map data for a specific uuid
    getMapDataByUUID(map, uuid) {
        const docRef = doc(this.db, 'users', uuid);

        // Creates default document if doesnt exist for user
        const docSnap = getDoc(docRef);
        if (!docSnap.exists) {
            const defaultDoc = doc(this.db, 'users', 'default');
            getDoc(defaultDoc).then((doc) => {
                setDoc(docRef, doc.data());
            });
        }

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

        return setDoc(docRef, 
            { [map]: JSON.stringify(data)}, { merge: true });
    }
}