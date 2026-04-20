"use server";

import { adminDb } from "@/lib/firebase-admin";
import { Invoice, BusinessProfile } from "@/types/invoice";

/**
 * SAVE INVOICE (Create or Update)
 * Uses Admin SDK to bypass security rules while maintaining server-side security.
 */
export async function saveInvoice(userId: string, invoiceData: Partial<Invoice>) {
  try {
    const { id, ...data } = invoiceData;

    if (id) {
      // UPDATE EXISTING
      await adminDb.collection("invoices").doc(id).update({
        ...data,
        updatedAt: Date.now()
      });
      return { success: true, id };
    } else {
      // CREATE NEW
      const docRef = await adminDb.collection("invoices").add({
        ...data,
        userId,
        createdAt: Date.now(),
        status: invoiceData.status || "draft"
      });
      return { success: true, id: docRef.id };
    }
  } catch (error: any) {
    console.error("Error saving invoice via Admin SDK:", error);
    return { success: false, error: error.message };
  }
}

/**
 * GET ALL INVOICES FOR USER
 */
export async function getInvoices(userId: string) {
  try {
    const snapshot = await adminDb.collection("invoices")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
    const invoices = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Invoice));
    
    return { success: true, invoices };
  } catch (error: any) {
    console.error("Error fetching invoices via Admin SDK:", error);
    return { success: false, error: error.message };
  }
}

/**
 * GET SINGLE INVOICE
 */
export async function getInvoiceById(invoiceId: string) {
  try {
    const doc = await adminDb.collection("invoices").doc(invoiceId).get();
    if (doc.exists) {
      return { success: true, invoice: { id: doc.id, ...doc.data() } as Invoice };
    }
    return { success: false, error: "Invoice not found" };
  } catch (error: any) {
    console.error("Error fetching invoiceById via Admin SDK:", error);
    return { success: false, error: error.message };
  }
}

/**
 * DELETE INVOICE
 */
export async function deleteInvoice(invoiceId: string) {
  try {
    await adminDb.collection("invoices").doc(invoiceId).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invoice via Admin SDK:", error);
    return { success: false, error: error.message };
  }
}

/**
 * GET BUSINESS PROFILES
 */
export async function getBusinessProfiles(userId: string) {
  try {
    const snapshot = await adminDb.collection("businessProfiles")
      .where("userId", "==", userId)
      .get();
    
    const profiles = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as BusinessProfile));
    
    return { success: true, profiles };
  } catch (error: any) {
    console.error("Error fetching profiles via Admin SDK:", error);
    return { success: false, error: error.message };
  }
}

/**
 * SAVE BUSINESS PROFILE
 */
export async function saveBusinessProfile(userId: string, profileData: Omit<BusinessProfile, "id" | "createdAt">) {
  try {
    const docRef = await adminDb.collection("businessProfiles").add({
      ...profileData,
      userId,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error saving profile via Admin SDK:", error);
    return { success: false, error: error.message };
  }
}
