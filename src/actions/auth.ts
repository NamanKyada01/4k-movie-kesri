'use server';

// Auth Server Actions — 4K Movie Kesri Surat
// Same pattern as reference project (D:\2025 New Projects\next)

import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { sendOtpEmail } from '@/lib/nodemailer';
import { randomInt } from 'crypto';

// ─── Send OTP ─────────────────────────────────────────────────────────────
export async function sendOtp(email: string) {
  try {
    // Check if email is whitelisted as admin
    const adminDoc = await adminDb.collection('adminUsers').doc(email).get();
    if (!adminDoc.exists) {
      return { success: false, error: 'This email is not authorized as admin.' };
    }

    const otp = randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP in Firestore
    await adminDb.collection('otps').doc(email).set({ otp, expiresAt });

    // Send branded email
    await sendOtpEmail(email, otp);

    return { success: true };
  } catch (error) {
    console.error('sendOtp error:', error);
    return { success: false, error: 'Failed to send OTP. Try again.' };
  }
}

// ─── Verify OTP ───────────────────────────────────────────────────────────
export async function verifyOtp(email: string, otp: string) {
  try {
    const doc = await adminDb.collection('otps').doc(email).get();

    if (!doc.exists) {
      return { success: false, error: 'OTP not found. Please request a new one.' };
    }

    const data = doc.data()!;

    if (data.otp !== otp) {
      return { success: false, error: 'Invalid OTP. Please check and try again.' };
    }

    if (Date.now() > data.expiresAt) {
      await adminDb.collection('otps').doc(email).delete();
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    // Get or create Firebase Auth user
    let uid: string;
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      uid = userRecord.uid;
    } catch {
      const userRecord = await adminAuth.createUser({ email, emailVerified: true });
      uid = userRecord.uid;
    }

    // Update admin last login
    await adminDb.collection('adminUsers').doc(email).update({
      lastLogin: Date.now(),
      uid,
    });

    // Create custom token for client sign-in
    const customToken = await adminAuth.createCustomToken(uid);

    // Clean up OTP
    await adminDb.collection('otps').doc(email).delete();

    // Fetch admin data
    const adminDoc = await adminDb.collection('adminUsers').doc(email).get();
    const adminData = adminDoc.data();

    return {
      success: true,
      token: customToken,
      user: {
        email,
        role: adminData?.role || 'viewer',
        name: adminData?.name || '',
      },
    };
  } catch (error) {
    console.error('verifyOtp error:', error);
    return { success: false, error: 'Verification failed. Please try again.' };
  }
}

// ─── Get Current Admin ────────────────────────────────────────────────────
export async function getAdminUser(email: string) {
  try {
    const doc = await adminDb.collection('adminUsers').doc(email).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch {
    return null;
  }
}

// ─── Bootstrap: Add First Admin (run once from seeder) ───────────────────
export async function addAdminUser(
  email: string,
  name: string,
  role: 'owner' | 'admin' | 'viewer' = 'admin'
) {
  await adminDb.collection('adminUsers').doc(email).set({
    email,
    name,
    role,
    permissions: role === 'owner' ? ['*'] : ['manage_content', 'manage_events'],
    createdAt: Date.now(),
    isActive: true
  });
  return { success: true };
}

// ─── Get All Admin Users ──────────────────────────────────────────────────
export async function getAllAdminUsers() {
  try {
    const snap = await adminDb.collection('adminUsers').orderBy('createdAt', 'desc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to get admin users:', error);
    return [];
  }
}

// ─── Delete Admin User ────────────────────────────────────────────────────
export async function deleteAdminUser(email: string) {
  try {
    await adminDb.collection('adminUsers').doc(email).delete();
    
    // Also delete their Firebase Auth account if it exists
    try {
      const user = await adminAuth.getUserByEmail(email);
      await adminAuth.deleteUser(user.uid);
    } catch {
      // Ignored if they haven't logged in yet
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete admin:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
