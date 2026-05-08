import { adminDb } from "@/lib/firebase-admin";
import { Tv, Radio, Clock, Calendar, PlayCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DhyeyTvClient } from "./DhyeyTvClient";

async function getDhyeyTvData() {
  try {
    const [configSnap, contentSnap] = await Promise.all([
      adminDb.collection("settings").doc("globalContent").get(),
      adminDb.collection("settings").doc("dhyeyTvContent").get(),
    ]);

    return {
      videoId: configSnap.exists ? configSnap.data()?.dhyeyTvUrl || "eQuoqPa1XIE" : "eQuoqPa1XIE",
      schedule: contentSnap.exists ? contentSnap.data()?.schedule || [] : [],
    };
  } catch (err) {
    console.error("Dhyey TV fetch error:", err);
    return { videoId: "eQuoqPa1XIE", schedule: [] };
  }
}

export default async function DhyeyTvPage() {
  const { videoId, schedule } = await getDhyeyTvData();

  return (
    <DhyeyTvClient initialVideoId={videoId} schedule={schedule} />
  );
}
