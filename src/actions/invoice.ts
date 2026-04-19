"use server";

import { adminDb } from "@/lib/firebase-admin";
import { Invoice, BusinessProfile } from "@/types/invoice";

// --- Business Profile ---

export async function saveBusinessProfile(
  userId: string,
  profile: Omit<BusinessProfile, "userId" | "updatedAt">
) {
  try {
    const profileId = profile.id || adminDb.collection("users").doc().id;
    const profileData = {
      ...profile,
      id: profileId,
      userId,
      updatedAt: Date.now(),
    };

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("businessProfiles")
      .doc(profileId)
      .set(profileData, { merge: true });

    return { success: true, id: profileId };
  } catch (error) {
    console.error("Error saving business profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}

export async function getBusinessProfiles(userId: string) {
  try {
    const snapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("businessProfiles")
      .orderBy("updatedAt", "desc")
      .get();

    const profiles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BusinessProfile[];

    return { success: true, profiles };
  } catch (error) {
    console.error("Error fetching business profiles:", error);
    return { success: false, error: "Failed to fetch profiles" };
  }
}

export async function deleteBusinessProfile(userId: string, profileId: string) {
  try {
    await adminDb
      .collection("users")
      .doc(userId)
      .collection("businessProfiles")
      .doc(profileId)
      .delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting business profile:", error);
    return { success: false, error: "Failed to delete profile" };
  }
}

export async function saveInvoice(
  userId: string,
  invoice: Omit<Invoice, "id" | "userId" | "createdAt">
) {
  try {
    const invoiceData = {
      ...invoice,
      userId,
      createdAt: Date.now(),
    };

    const docRef = await adminDb
      .collection("users")
      .doc(userId)
      .collection("invoices")
      .add(invoiceData);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving invoice:", error);
    return { success: false, error: "Failed to save invoice" };
  }
}

export async function getInvoices(userId: string) {
  try {
    const snapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("invoices")
      .orderBy("date", "desc")
      .get();

    const invoices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Invoice[];

    return { success: true, invoices };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

export async function getInvoiceById(userId: string, invoiceId: string) {
  try {
    const docSnap = await adminDb
      .collection("users")
      .doc(userId)
      .collection("invoices")
      .doc(invoiceId)
      .get();

    if (docSnap.exists) {
      return {
        success: true,
        invoice: { id: docSnap.id, ...docSnap.data() } as Invoice,
      };
    } else {
      return { success: false, error: "Invoice not found" };
    }
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return { success: false, error: "Failed to fetch invoice" };
  }
}
