// Import the functions you need from the SDKs you need
import app from './FirebaseAppConnection.js';
import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export class MapStorage {

    constructor() {
        this.db = getFirestore(app);
    }

    // Returns json containing all map data for a specific uuid
    getMapDataByUUID(map, uuid) {

        // Promise to get map data or error
        return new Promise((resolve, reject) => {
            const documentRef = doc(this.db, 'users', uuid);

            // If document exists returns data otherwise sets default data first
            getDoc(documentRef).then((docObject) => {
                if (docObject.exists) {
                    const docData = docObject.data();
                    if (docData) {
                        resolve(JSON.parse(docData[map]));
                    }
                    else {
                        // Get default document and return map data
                        const defaultDocRef = doc(this.db, 'users', 'default');
                        getDoc(defaultDocRef).then((doc) => {
                            setDoc(documentRef, doc.data());
                            resolve(JSON.parse(doc.data()[map]));
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    // Sets map data at a certain UUID
    setMapDataByUUID(map, data, uuid) {

        const docRef = doc(this.db, 'users', uuid);

        return setDoc(docRef, 
            { [map]: JSON.stringify(data)}, {merge: true});
    }
}