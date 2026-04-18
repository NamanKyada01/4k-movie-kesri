import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const email = "4kmovie2672.2@gmail.com";
    
    // Check if the user already exists
    const usersRef = adminDb.collection("adminUsers");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return NextResponse.json({ message: "Admin user already exists." });
    }

    // Create the master admin record
    await usersRef.add({
      email,
      name: "Master Admin",
      role: "owner",
      permissions: ["super_admin"],
      createdAt: Date.now(),
      isActive: true
    });

    return NextResponse.json({ message: "Successfully seeded initial master admin!" });
  } catch (error: any) {
    console.error("Failed to seed admin:", error);
    return NextResponse.json(
      { error: "Failed to seed admin", details: error.message },
      { status: 500 }
    );
  }
}
