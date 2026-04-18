import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const email = "4kmovie2672.2@gmail.com";
    
    const usersRef = adminDb.collection("adminUsers");
    
    // Create the master admin record with the email AS the document ID
    await usersRef.doc(email).set({
      email,
      name: "Master Admin",
      role: "owner",
      permissions: ["super_admin"],
      createdAt: Date.now(),
      isActive: true
    });

    return NextResponse.json({ message: "Successfully seeded initial master admin with correct document ID!" });
  } catch (error: any) {
    console.error("Failed to seed admin:", error);
    return NextResponse.json(
      { error: "Failed to seed admin", details: error.message },
      { status: 500 }
    );
  }
}
