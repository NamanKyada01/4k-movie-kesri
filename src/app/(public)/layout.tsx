import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReactNode } from "react";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let maintenanceMode = false;
  let supportPhone = "";

  let configData = null;

  try {
    const configDoc = await adminDb.collection("settings").doc("globalConfig").get();
    if (configDoc.exists) {
      configData = configDoc.data();
      maintenanceMode = configData?.maintenanceMode || false;
      supportPhone = configData?.supportPhone || "";
    }
  } catch (err) {
    console.error("Failed to fetch site config:", err);
  }

  // Redirect if maintenance mode is enabled
  if (maintenanceMode) {
    redirect("/maintenance");
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-height)" }}>
        {children}
      </main>
      <Footer config={configData} />
      <WhatsAppButton phone={supportPhone} />
    </>
  );
}
