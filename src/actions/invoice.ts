"use server";

import { db } from "@/lib/firebase"; // Assuming db is exported from @/lib/firebase
import { Invoice, BusinessProfile } from "@/types/invoice";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";

export async function saveInvoice(userId: string, invoiceData: Omit<Invoice, "id" | "createdAt" | "status">) {
  try {
    const invoiceRef = collection(db, "invoices");
    const docRef = await addDoc(invoiceRef, {
      ...invoiceData,
      userId,
      status: "sent",
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error saving invoice:", error);
    return { success: false, error: error.message };
  }
}

export async function getInvoices(userId: string) {
  try {
    const invoiceRef = collection(db, "invoices");
    const q = query(invoiceRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
    return { success: true, invoices };
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    await deleteDoc(doc(db, "invoices", invoiceId));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: error.message };
  }
}

export async function getBusinessProfiles(userId: string) {
  try {
    const profileRef = collection(db, "businessProfiles");
    const q = query(profileRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BusinessProfile));
    return { success: true, profiles };
  } catch (error: any) {
    console.error("Error fetching profiles:", error);
    return { success: false, error: error.message };
  }
}

export async function saveBusinessProfile(userId: string, profileData: Omit<BusinessProfile, "id" | "createdAt">) {
  try {
    const profileRef = collection(db, "businessProfiles");
    const docRef = await addDoc(profileRef, {
      ...profileData,
      userId,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error saving profile:", error);
    return { success: false, error: error.message };
  }
}
