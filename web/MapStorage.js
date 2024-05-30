// Import the functions you need from the SDKs you need
import {getFirestore, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export class MapStorage {

    constructor(firebaseAppConnection) {
        // Your web app's Firebase configuration
        this.db = getFirestore(firebaseAppConnection);
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