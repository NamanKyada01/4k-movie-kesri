// Firebase Admin SDK — Server-only (same pattern as reference project)
import 'server-only';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const clientEmail   = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (clientEmail && rawPrivateKey && rawPrivateKey !== 'REPLACE_WITH_PRIVATE_KEY') {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId:   'k-movie-kesri',
          clientEmail,
          privateKey:  rawPrivateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (err) {
      console.warn('[Firebase Admin] Init failed:', (err as Error).message);
      // Fallback: unauthenticated client (local dev without service account)
      admin.initializeApp({ projectId: 'k-movie-kesri' });
    }
  } else {
    console.warn('[Firebase Admin] No credentials — set FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY in .env.local');
    admin.initializeApp({ projectId: 'k-movie-kesri' });
  }
}

export const adminAuth = admin.auth();
export const adminDb   = admin.firestore();
