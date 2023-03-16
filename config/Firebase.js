const admin = require("firebase-admin");
const serviceAccount = require("../Firebase-Admin-SDK.json");
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  ...firebaseConfig,
});

const db = admin.firestore();
const collectionRef = db.collection("Pantry");
module.exports = { collectionRef, db };
