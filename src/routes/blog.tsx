import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader } from "../components/site/Section";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — ByTech Software Solutions" },
      { name: "description", content: "Insights on web, mobile, AI, SaaS, and startup growth." },
      { property: "og:title", content: "ByTech Blog" },
      { property: "og:description", content: "Articles on web, mobile, AI, SaaS, and startup tips." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const categories = ["All", "Web Development", "Mobile Development", "AI", "SaaS", "Startup Tips"] as const;

const posts = [
  { title: "Choosing a tech stack for your MVP in 2025", category: "Startup Tips", date: "Jun 12, 2026", excerpt: "How to pick boring tech that scales without slowing you down." },
  { title: "Why Flutter still wins for cross-platform apps", category: "Mobile Development", date: "Jun 02, 2026", excerpt: "A practical look at Flutter vs React Native and native." },
  { title: "Building AI chatbots that actually help users", category: "AI", date: "May 20, 2026", excerpt: "RAG, guardrails, and UX patterns that move the needle." },
  { title: "From landing page to first 100 customers", category: "SaaS", date: "May 09, 2026", excerpt: "A founder's playbook for early distribution." },
  { title: "Server-side rendering with TanStack Start", category: "Web Development", date: "Apr 28, 2026", excerpt: "Why we switched and what we learned." },
  { title: "Hiring your first developer as a non-technical founder", category: "Startup Tips", date: "Apr 14, 2026", excerpt: "Avoid the 5 most common (and expensive) mistakes." },
];

function BlogPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(
    () => posts.filter((p) => (cat === "All" || p.category === cat) && (q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))),
    [q, cat],
  );

  return (
    <Section className="pt-16 md:pt-24">
      <div className="container-page">
        <SectionHeader eyebrow="Blog" title="Ideas, guides, and case studies" description="Practical writing on building, shipping, and growing digital products." />

        <div className="mt-10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles..." className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm outline-none focus:border-foreground" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${cat === c ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.title} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 transition">
              <div className="aspect-[16/9]" style={{ background: "var(--gradient-brand)" }} />
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs text-muted-foreground">{p.category} · {p.date}</span>
                <h3 className="mt-2 font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
                <a href="#" className="mt-4 text-sm font-medium">Read article →</a>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No articles match your search.</p>}
        </div>
      </div>
    </Section>
  );
}
