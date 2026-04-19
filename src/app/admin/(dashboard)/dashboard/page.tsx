import { adminDb } from "@/lib/firebase-admin";
import type { Event, ContactInquiry } from "@/types";
import { Metadata } from "next";
import DashboardMain from "./DashboardMain";

export const metadata: Metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboardPage() {
  let stats = {
    totalEvents: 0,
    totalPhotos: 0,
    pendingInquiries: 0,
  };
  let upcomingEvents: Event[] = [];
  let recentInquiries: ContactInquiry[] = [];

  try {
    const now = Date.now();
    const [eventsSnap, photosSnap, inquiriesSnap, upcomingSnap] = await Promise.all([
      adminDb.collection("events").count().get(),
      adminDb.collection("gallery").count().get(),
      adminDb.collection("contacts").where("status", "==", "new").get(),
      adminDb.collection("events").where("date", ">=", now).orderBy("date").limit(5).get(),
    ]);

    stats.totalEvents       = eventsSnap.data().count;
    stats.totalPhotos       = photosSnap.data().count;
    stats.pendingInquiries  = inquiriesSnap.size;
    
    upcomingEvents    = upcomingSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Event[];
    recentInquiries   = inquiriesSnap.docs.slice(0, 3).map((d) => ({ id: d.id, ...d.data() })) as ContactInquiry[];
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    // Firebase not yet configured or error — pass empty values
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <DashboardMain 
      stats={stats}
      upcomingEvents={upcomingEvents}
      recentInquiries={recentInquiries}
      greeting={greeting}
    />
  );
}
