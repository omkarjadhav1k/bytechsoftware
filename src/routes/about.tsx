import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, CTABanner } from "../components/site/Section";
import { Target, Eye, Code2 } from "lucide-react";
import developerAsset from "../assets/developer-omkar.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ByTech Software Solutions" },
      { name: "description", content: "Our story, mission, vision, and the founder behind ByTech Software Solutions." },
      { property: "og:title", content: "About — ByTech Software Solutions" },
      { property: "og:description", content: "Helping businesses leverage technology to grow faster and operate smarter." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const skills = ["Web Development", "Mobile Apps", "Firebase", "PHP", "MySQL", "Flutter", "AI Integration", "TypeScript", "Next.js", "Tailwind CSS"];

function AboutPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24 pb-0">
        <div className="container-page">
          <SectionHeader eyebrow="About us" title="A technology partner for ambitious teams" description="We're a focused product studio combining engineering rigor with founder-style empathy. We don't just write code — we ship outcomes." />
        </div>
      </Section>

      <Section>
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <Target className="h-6 w-6" />
            <h3 className="mt-4 text-xl font-semibold">Our Mission</h3>
            <p className="mt-2 text-muted-foreground">Helping businesses leverage technology to grow faster and operate smarter — with software that's reliable, modern, and built to scale.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <Eye className="h-6 w-6" />
            <h3 className="mt-4 text-xl font-semibold">Our Vision</h3>
            <p className="mt-2 text-muted-foreground">To become a trusted technology partner for startups and businesses worldwide — known for craftsmanship, speed, and outcomes.</p>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="container-page grid gap-10 md:grid-cols-[1fr_2fr] md:items-start">
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src={developerAsset.url}
                alt="Omkar Jadhav — Founder of ByTech Software Solutions"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">Founder</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Omkar Jadhav</h2>
            <p className="mt-1 text-muted-foreground">Computer Science Student · Full-Stack Developer · Founder of ByTech Software Solutions</p>
            <p className="mt-5 text-foreground/90">Omkar founded ByTech to bridge the gap between modern engineering and small-to-mid sized businesses. With hands-on experience across web, mobile, and AI, he leads every project with a focus on quality and long-term partnerships.</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium"><Code2 className="h-4 w-4" /> Core skills</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="rounded-full border border-border bg-background px-3 py-1 text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
