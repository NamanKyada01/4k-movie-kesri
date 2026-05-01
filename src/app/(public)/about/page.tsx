import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase-admin";
import { CinemaBackground } from "@/components/layout/CinemaBackground";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { ArrowRight, Eye, Heart, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — 4K Movie Kesri Surat",
  description:
    "Meet the team behind 4K Movie Kesri Surat. 8+ years of cinematic photography and videography excellence in Surat, Gujarat.",
};

const values = [
  {
    icon: Eye,
    title: "Cinematic Vision",
    desc: "We don't just photograph — we direct. Every frame is composed with the precision of a feature film.",
  },
  {
    icon: Heart,
    title: "Emotional Authenticity",
    desc: "We chase real moments. The laugh, the tear, the glance — these are the frames that last a lifetime.",
  },
  {
    icon: Zap,
    title: "Technical Excellence",
    desc: "Sony & Canon cinema cameras, professional lighting rigs, and 4K post-production workflows.",
  },
  {
    icon: Shield,
    title: "Reliability",
    desc: "We've never missed a delivery. Every project is backed by a clear timeline and a dedicated editor.",
  },
];

const team = [
  {
    name: "Kesri Patel",
    role: "Founder & Lead Cinematographer",
    bio: "8+ years behind the lens. Trained in Mumbai's film industry before bringing cinematic storytelling to Surat.",
    initials: "KP",
  },
  {
    name: "Meera Shah",
    role: "Senior Photographer",
    bio: "Specializes in candid wedding photography and editorial portraiture. Known for her mastery of natural light.",
    initials: "MS",
  },
  {
    name: "Aryan Desai",
    role: "Video Editor & Colorist",
    bio: "Post-production specialist with expertise in DaVinci Resolve color grading and cinematic sound design.",
    initials: "AD",
  },
];

const milestones = [
  { year: "2016", event: "Studio founded in Surat with a single camera and a big dream." },
  { year: "2018", event: "Expanded to a full team of 5. First corporate client — a Fortune 500 company." },
  { year: "2020", event: "Upgraded to full 4K cinema workflow. Launched Dhyey TV YouTube channel." },
  { year: "2022", event: "500th event milestone. Recognized as Surat's top wedding studio." },
  { year: "2024", event: "Launched AI-powered blog and premium album service. 50+ industry awards." },
];

export default async function AboutPage() {
  let aboutText = "";
  try {
    const contentDoc = await adminDb.collection("settings").doc("globalContent").get();
    if (contentDoc.exists) {
      aboutText = contentDoc.data()?.aboutText || "";
    }
  } catch (err) {
    console.error("About page fetch error:", err);
  }

  const defaultAbout =
    "Since opening our doors in Surat, Gujarat, 4K Movie Kesri has been driven by a singular passion: turning fleeting moments into timeless masterpieces. We believe that photography isn't just about clicking a button — it's about anticipating emotions, managing brilliant lighting, and crafting a cinematic narrative.";

  return (
    <>
      <CinemaBackground theme={{ primary: "indigo", secondary: "violet" }} />

      {/* ── Hero ── */}
      <section
        className="section"
        style={{ background: "transparent", paddingTop: "clamp(8rem, 15vh, 12rem)" }}
      >
        <div className="container" style={{ maxWidth: 860 }}>
          <ScrollReveal>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Who We Are
            </span>
            <h1
              style={{
                marginTop: "var(--space-3)",
                marginBottom: "var(--space-5)",
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              The Visionaries<br />
              <span style={{ color: "var(--accent)" }}>Behind The Lens</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                marginBottom: "var(--space-5)",
              }}
            >
              {aboutText || defaultAbout}
            </p>
            {!aboutText && (
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "var(--space-8)",
                }}
              >
                With over 8 years of industry experience, top-tier 4K cinema cameras, and a
                dedicated team of editors and directors, we bring a true Hollywood-style production
                level to weddings and corporate events across India.
              </p>
            )}
            <Link href="/contact" className="btn btn-primary btn-lg">
              Work With Us <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "var(--space-8) 0",
        }}
      >
        <div className="container">
          <div className="about-stats-grid">
            {[
              { number: "500+", label: "Events Covered" },
              { number: "10K+", label: "Photos Delivered" },
              { number: "8+", label: "Years Experience" },
              { number: "50+", label: "Awards Won" },
              { number: "200+", label: "5-Star Reviews" },
              { number: "48h", label: "Delivery Turnaround" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 900,
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    color: "var(--accent)",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ marginBottom: "var(--space-10)" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                What Drives Us
              </span>
              <h2 style={{ marginTop: "var(--space-2)" }}>Our Core Values</h2>
            </div>
          </ScrollReveal>

          <div className="values-grid">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <ScrollReveal key={v.title} delay={i * 0.1}>
                  <div
                    className="value-card"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-2xl)",
                      padding: "var(--space-8)",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "var(--radius-lg)",
                        background: "var(--accent-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "var(--space-5)",
                      }}
                    >
                      <Icon size={22} color="var(--accent)" />
                    </div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "var(--space-3)" }}>
                      {v.title}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
                      {v.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Our Approach ── */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-12)",
              alignItems: "center",
            }}
            className="about-approach-grid"
          >
            {/* Visual placeholder */}
            <ScrollReveal>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    aspectRatio: "4/5",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-2xl)",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(196,149,106,0.05) 0%, rgba(0,0,0,0.5) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "5rem",
                      opacity: 0.08,
                    }}
                  >
                    📸
                  </div>
                  {/* Floating badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 24,
                      left: 24,
                      right: 24,
                      background: "var(--bg-glass)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid var(--bg-glass-border)",
                      borderRadius: "var(--radius-xl)",
                      padding: "var(--space-4) var(--space-5)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--accent)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      Studio Est.
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 900,
                        fontSize: "2rem",
                        color: "var(--text-primary)",
                        lineHeight: 1,
                      }}
                    >
                      2016
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                      Surat, Gujarat
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Steps */}
            <ScrollReveal delay={0.15}>
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  How We Work
                </span>
                <h2 style={{ marginBottom: "var(--space-8)" }}>Our Approach</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
                  {[
                    {
                      step: "01",
                      title: "Consultation",
                      desc: "We sit down with you to understand your vision, aesthetic preference, and event timeline.",
                    },
                    {
                      step: "02",
                      title: "Production",
                      desc: "On the day, we bring our cutting-edge 4K gear and cinematic lighting to capture everything flawlessly.",
                    },
                    {
                      step: "03",
                      title: "Post-Processing",
                      desc: "Our editors meticulously color grade, retouch, and compile the footage into a masterpiece.",
                    },
                    {
                      step: "04",
                      title: "Delivery",
                      desc: "Your private gallery is ready within 48 hours — fully edited, color graded, and download-ready.",
                    },
                  ].map((item) => (
                    <div key={item.step} style={{ display: "flex", gap: "var(--space-5)" }}>
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 900,
                          color: "var(--accent)",
                          lineHeight: 1,
                          fontFamily: "var(--font-heading)",
                          flexShrink: 0,
                          width: 36,
                        }}
                      >
                        {item.step}.
                      </div>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", marginBottom: "var(--space-2)" }}>
                          {item.title}
                        </h4>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ marginBottom: "var(--space-10)" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                The Crew
              </span>
              <h2 style={{ marginTop: "var(--space-2)" }}>Meet the Team</h2>
            </div>
          </ScrollReveal>

          <div className="team-grid">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <div
                  className="team-card"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-2xl)",
                    padding: "var(--space-8)",
                    textAlign: "center",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "var(--accent-muted)",
                      border: "2px solid var(--border-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginInline: "auto",
                      marginBottom: "var(--space-5)",
                      fontSize: "1.4rem",
                      fontWeight: 900,
                      color: "var(--accent)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {member.initials}
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "var(--space-1)" }}>
                    {member.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--accent)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {member.role}
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section journey-section" style={{ background: "var(--bg-secondary)", overflow: "hidden" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(var(--space-10), 6vw, var(--space-16))" }}>
              <span className="journey-eyebrow">Our Journey</span>
              <h2 className="journey-heading">
                Studio <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Milestones</em>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: 420, marginInline: "auto", marginTop: "var(--space-3)" }}>
                Eight years of capturing life&apos;s most defining moments — one frame at a time.
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline track */}
          <div className="journey-track">
            {/* Centre spine */}
            <div className="journey-spine" aria-hidden="true" />

            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <ScrollReveal key={m.year} delay={i * 0.12}>
                  <div className={`journey-row ${isLeft ? "journey-row--left" : "journey-row--right"}`}>

                    {/* Card */}
                    <div className="journey-card">
                      {/* Gold top border */}
                      <div className="journey-card-bar" />

                      {/* Year badge */}
                      <div className="journey-year">{m.year}</div>

                      {/* Event text */}
                      <p className="journey-event">{m.event}</p>

                      {/* Milestone number */}
                      <div className="journey-index">0{i + 1}</div>
                    </div>

                    {/* Connector to spine */}
                    <div className="journey-connector" aria-hidden="true">
                      <div className="journey-connector-line" />
                      <div className="journey-dot">
                        <div className="journey-dot-inner" />
                      </div>
                    </div>

                    {/* Empty spacer on the other side */}
                    <div className="journey-spacer" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        <style>{`
          .journey-section { position: relative; }

          .journey-eyebrow {
            display: block;
            font-size: 0.68rem;
            color: var(--accent);
            letter-spacing: 0.22em;
            text-transform: uppercase;
            font-weight: 600;
            font-family: var(--font-body);
            margin-bottom: var(--space-2);
          }

          .journey-heading {
            font-size: clamp(1.9rem, 5vw, 3rem);
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.1;
          }

          /* ── Track ── */
          .journey-track {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: var(--space-6);
          }

          /* Vertical gold spine */
          .journey-spine {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px;
            transform: translateX(-50%);
            background: linear-gradient(
              to bottom,
              transparent 0%,
              var(--border-accent) 8%,
              var(--border-accent) 92%,
              transparent 100%
            );
          }

          /* ── Row ── */
          .journey-row {
            display: grid;
            grid-template-columns: 1fr 40px 1fr;
            align-items: center;
            gap: 0;
            min-height: 120px;
          }

          /* Left card: card | connector | spacer */
          .journey-row--left .journey-card     { grid-column: 1; grid-row: 1; justify-self: end; }
          .journey-row--left .journey-connector { grid-column: 2; grid-row: 1; }
          .journey-row--left .journey-spacer   { grid-column: 3; grid-row: 1; }

          /* Right card: spacer | connector | card */
          .journey-row--right .journey-spacer   { grid-column: 1; grid-row: 1; }
          .journey-row--right .journey-connector { grid-column: 2; grid-row: 1; }
          .journey-row--right .journey-card     { grid-column: 3; grid-row: 1; justify-self: start; }

          /* ── Card ── */
          .journey-card {
            position: relative;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-2xl);
            padding: var(--space-6) var(--space-6) var(--space-5);
            width: calc(50vw - 60px);
            max-width: 480px;
            overflow: hidden;
            transition: border-color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease;
          }
          .journey-card:hover {
            border-color: var(--border-accent);
            transform: translateY(-3px);
            box-shadow: 0 12px 40px rgba(212,160,23,0.10);
          }

          /* Gold top bar */
          .journey-card-bar {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--accent), var(--gold), var(--accent));
            opacity: 0.6;
          }
          .journey-card:hover .journey-card-bar { opacity: 1; }

          /* Year */
          .journey-year {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 1.6rem;
            color: var(--accent);
            line-height: 1;
            margin-bottom: var(--space-3);
            letter-spacing: 0.02em;
          }

          /* Event */
          .journey-event {
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.65;
            margin: 0;
          }

          /* Watermark index */
          .journey-index {
            position: absolute;
            bottom: 8px;
            right: 14px;
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 3.5rem;
            color: var(--accent);
            opacity: 0.05;
            line-height: 1;
            user-select: none;
            pointer-events: none;
          }

          /* ── Connector ── */
          .journey-connector {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            height: 100%;
          }
          .journey-connector-line {
            position: absolute;
            top: 50%;
            left: 0; right: 0;
            height: 1px;
            background: var(--border-accent);
            transform: translateY(-50%);
            opacity: 0.5;
          }
          .journey-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--bg-secondary);
            border: 2px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
            box-shadow: 0 0 0 4px var(--accent-muted);
            transition: box-shadow 0.28s ease;
          }
          .journey-card:hover ~ .journey-connector .journey-dot,
          .journey-row:hover .journey-dot {
            box-shadow: 0 0 0 6px var(--accent-muted), 0 0 16px var(--accent-glow);
          }
          .journey-dot-inner {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent);
          }

          /* ── Mobile: single column ── */
          @media (max-width: 700px) {
            .journey-spine { display: none; }
            .journey-track { gap: var(--space-4); }

            .journey-row {
              display: block;
            }
            .journey-connector { display: none; }
            .journey-spacer    { display: none; }

            .journey-card {
              width: 100%;
              max-width: 100%;
              justify-self: unset !important;
            }
          }
        `}</style>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ background: "var(--bg-primary)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <ScrollReveal>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              Let&apos;s Create Something <span style={{ color: "var(--accent)" }}>Timeless</span>
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-8)", fontSize: "0.95rem" }}>
              Ready to work with Surat&apos;s most trusted photography studio? We&apos;d love to hear your story.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary btn-xl">
                Book a Session <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="btn btn-ghost btn-xl">
                View Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--space-4);
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }
        .value-card, .team-card {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .value-card:hover, .team-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-accent) !important;
        }
        @media (max-width: 1024px) {
          .about-stats-grid { grid-template-columns: repeat(3, 1fr); }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .about-approach-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .about-stats-grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
          .values-grid { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 420px) {
          .about-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
