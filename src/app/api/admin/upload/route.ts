import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // Basic Security Check: Needs internal JWT token or valid session to allow upload
    // In actual production we'd verify the Firebase session cookie or a custom JWT.
    
    // Process form data
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const folder = (formData.get("folder") as string) || "4kmoviekesri-main";
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Need to convert Web File to Buffer for Cloudinary uploader.upload_stream
      const buffer = Buffer.from(await file.arrayBuffer());
      
      return new Promise<{ secure_url: string; public_id: string; width: number; height: number }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "auto" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
            });
          }
        );
        uploadStream.end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Cloudinary bulk upload error:", error);
    return NextResponse.json({ error: "Failed to upload image(s)." }, { status: 500 });
  }
}
