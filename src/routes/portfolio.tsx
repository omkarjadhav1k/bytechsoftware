import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, CTABanner } from "../components/site/Section";
import { ExternalLink, FileText } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — ByTech Software Solutions" },
      { name: "description", content: "Selected projects we've designed and engineered." },
      { property: "og:title", content: "Portfolio — ByTech" },
      { property: "og:description", content: "Case studies and live demos from our recent work." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

const projects = [
  { name: "CareerPilot AI", tech: ["Next.js", "OpenAI", "Supabase"], desc: "AI career coach that creates personalized career roadmaps for students.", grad: "linear-gradient(135deg,#6366f1,#a855f7)" },
  { name: "Bike Showroom Management", tech: ["PHP", "MySQL", "Bootstrap"], desc: "End-to-end inventory, billing, and service management for showrooms.", grad: "linear-gradient(135deg,#0ea5e9,#06b6d4)" },
  { name: "Smart Document Locker", tech: ["Flutter", "Firebase", "AES"], desc: "Encrypted personal document vault with secure sharing and offline access.", grad: "linear-gradient(135deg,#10b981,#22d3ee)" },
  { name: "Startup Pitching Platform", tech: ["React", "Node.js", "Mongo"], desc: "Match founders with investors via curated, async video pitches.", grad: "linear-gradient(135deg,#f43f5e,#f97316)" },
  { name: "StudyDriveX", tech: ["Flutter", "Firebase"], desc: "Notes, past papers, and study planning for engineering students.", grad: "linear-gradient(135deg,#8b5cf6,#ec4899)" },
  { name: "ByTech CRM", tech: ["TypeScript", "Postgres"], desc: "Internal CRM with deal pipelines, invoices, and client portals.", grad: "linear-gradient(135deg,#0f172a,#475569)" },
];

function PortfolioPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24 pb-0">
        <div className="container-page">
          <SectionHeader eyebrow="Portfolio" title="Recent work, real outcomes" description="A small selection of products we've shipped for clients and our own ventures." />
        </div>
      </Section>

      <Section>
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.name} className="group rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
              <div className="aspect-[4/3] relative" style={{ background: p.grad }}>
                <div className="absolute inset-0 grid place-items-center text-white/95 text-xl font-semibold tracking-tight px-6 text-center">{p.name}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{t}</span>)}
                </div>
                <div className="mt-6 flex gap-2 pt-4 border-t border-border">
                  <a href="#" className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3.5 py-1.5 text-xs font-medium">
                    <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                  </a>
                  <a href="#" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium">
                    <FileText className="h-3.5 w-3.5" /> Case Study
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
