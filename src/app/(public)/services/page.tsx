import { adminDb } from "@/lib/firebase-admin";
import { Camera, Video, MonitorPlay, Users, PackageOpen, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const iconMap: Record<string, any> = { Camera, Video, MonitorPlay, Users, PackageOpen, Award };

async function getServicesData() {
  try {
    const snap = await adminDb.collection("settings").doc("servicesContent").get();
    return snap.exists ? snap.data()?.services || [] : [];
  } catch (err) {
    console.error("Services fetch error:", err);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServicesData();

  return (
    <>
      <CinemaBackground theme={{ primary: "indigo", secondary: "rose" }} />
      {/* ── Hero ── */}
      <section
        className="section"
        style={{
          background: "transparent",
          paddingTop: "clamp(8rem, 15vh, 12rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <ScrollReveal>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                display: "block",
                marginBottom: "var(--space-4)",
              }}
            >
              The Repository
            </span>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                marginBottom: "var(--space-6)",
              }}
            >
              Our Professional <br />
              <span style={{ color: "var(--accent)" }}>Services</span>
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: 600,
                marginBottom: "var(--space-8)",
              }}
            >
              A curated suite of high-fidelity media services. We blend cinematic vision with
              surgical technical precision to capture moments that transcend time.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Services List ── */}
      <section className="section" style={{ paddingTop: "var(--space-8)" }}>
        <div className="container">
          <div 
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}
            className="services-grid"
          >
            {services.map((svc: any, i: number) => {
              const Icon = iconMap[svc.iconName] || Camera;
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div
                    className="services-editorial-item"
                    style={{
                      background: "var(--bg-elevated)",
                      padding: "var(--space-8)",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "var(--radius-2xl)",
                      border: "1px solid rgba(255,255,255,0.03)",
                      backdropFilter: "blur(20px)",
                      height: "100%"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -20,
                        right: -20,
                        opacity: 0.04,
                        color: "var(--accent)",
                      }}
                    >
                      <Icon size={160} />
                    </div>

                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "var(--radius-xl)",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "var(--space-6)",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      <Icon size={22} color="var(--accent)" />
                    </div>

                    <div style={{ position: "relative", zIndex: 2, flexGrow: 1 }}>
                      <h3
                        style={{
                          fontSize: "1.35rem",
                          marginBottom: "var(--space-3)",
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                        }}
                      >
                        {svc.title}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.9rem",
                          lineHeight: 1.7,
                          marginBottom: "var(--space-6)",
                        }}
                      >
                        {svc.desc}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "var(--space-6)" }}>
                        {svc.features?.map((feat: string, j: number) => (
                          <span
                            key={j}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: "0.72rem",
                              color: "var(--text-secondary)",
                              background: "rgba(255,255,255,0.04)",
                              padding: "5px 12px",
                              borderRadius: "var(--radius-full)",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              border: "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            <CheckCircle2 size={10} color="var(--accent)" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      Enquire Now <ArrowRight size={13} />
                    </Link>

                    <div
                      className="service-accent-bar"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: "var(--accent)",
                        opacity: 0.3,
                      }}
                    />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .services-editorial-item {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .services-editorial-item:hover {
          background: var(--bg-card) !important;
          border-color: var(--border-accent) !important;
          transform: translateY(-4px);
        }
        .services-editorial-item:hover .service-accent-bar {
          opacity: 1 !important;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
