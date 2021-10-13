import admin from "firebase-admin";

const firebase: {
    database: admin.database.Database | undefined;
    storage: admin.storage.Storage | undefined;
    error?: Error;
} = {
    database: undefined,
    storage: undefined,
};

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY,
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        firebase.database = admin.database();
        firebase.storage = admin.storage();
        firebase.error = undefined;
    } catch (error: any) {
        console.error("Failed to initialize firebase:", error);
        firebase.database = undefined;
        firebase.storage = undefined;
        firebase.error = error;
    }
} else {
    firebase.database = admin.database();
    firebase.storage = admin.storage();
    firebase.error = undefined;
}

export default firebase;
