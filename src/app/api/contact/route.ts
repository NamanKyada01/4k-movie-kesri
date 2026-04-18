import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, eventType, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const name = `${firstName} ${lastName}`.trim();
    
    // 1. Save to Firestore
    const inquiryData = {
      name,
      email,
      phone: phone || "Not provided",
      serviceType: eventType || "other",
      message,
      status: "new",
      createdAt: Date.now(),
    };

    await adminDb.collection("contacts").add(inquiryData);

    // 2. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // 3. Send Notification Email to Admin
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Send via the authenticated email to dodge spam filters
        replyTo: email, // If they reply, it goes to the client!
        to: process.env.EMAIL_USER, // Send TO themselves
        subject: `New Inquiry: ${eventType.toUpperCase()} from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #111; color: #fff; border-radius: 10px;">
            <h2 style="color: #e8550a;">New Studio Inquiry 📸</h2>
            <p style="font-size: 16px;">You have received a new lead via the 4K Movie Kesri website.</p>
            <div style="background: #222; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Service Requested:</strong> <span style="text-transform: capitalize;">${eventType || 'Other'}</span></p>
              <p><strong>Message:</strong></p>
              <p style="background: #333; padding: 10px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Sent automatically from 4kmoviekesri.com</p>
          </div>
        `,
      };
      
      await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Inquiry sent successfully!" });
  } catch (error: any) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { error: "Failed to send inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
