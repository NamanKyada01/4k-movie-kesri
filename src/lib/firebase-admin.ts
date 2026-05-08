import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } else {
      console.warn("Missing FIREBASE_PROJECT_ID, skipping Firebase Admin initialization for build.");
      admin.initializeApp({ projectId: "placeholder-project" });
    }
  } catch (error) {
    console.error("Firebase Admin initialization error", error);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
