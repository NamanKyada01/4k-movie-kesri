"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

// --- EVENT MUTATIONS ---

export async function createEvent(data: any) {
  try {
    const docRef = await adminDb.collection("events").add({
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEvent(id: string, data: any) {
  try {
    await adminDb.collection("events").doc(id).update({
      ...data,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating event:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEvent(id: string) {
  try {
    await adminDb.collection("events").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }
}

// --- EQUIPMENT MUTATIONS ---

export async function createEquipment(data: any) {
  try {
    const docRef = await adminDb.collection("equipment").add({
      ...data,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateEquipment(id: string, data: any) {
  try {
    await adminDb.collection("equipment").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEquipment(id: string) {
  try {
    await adminDb.collection("equipment").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- STAFF MUTATIONS ---

export async function createStaff(data: any) {
  try {
    const docRef = await adminDb.collection("staff").add({
      ...data,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStaff(id: string, data: any) {
  try {
    await adminDb.collection("staff").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteStaff(id: string) {
  try {
    await adminDb.collection("staff").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- GALLERY MUTATIONS ---

export async function updateGalleryPhoto(id: string, data: any) {
  try {
    await adminDb.collection("gallery").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryPhoto(id: string) {
  try {
    await adminDb.collection("gallery").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- INQUIRY MUTATIONS ---

export async function updateInquiry(id: string, data: any) {
  try {
    await adminDb.collection("contacts").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await adminDb.collection("contacts").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- YOUTUBE MUTATIONS ---

export async function createYouTubeVideo(data: any) {
  try {
    const docRef = await adminDb.collection("youtubeVideos").add({
      ...data,
      createdAt: Date.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteYouTubeVideo(id: string) {
  try {
    await adminDb.collection("youtubeVideos").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
