import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Rocket, Shield, LifeBuoy, Code, Smartphone, Brain, Layout, Database, Sparkles, Star } from "lucide-react";
import { Section, SectionHeader, CTABanner } from "../components/site/Section";
import { Typewriter } from "../components/site/Typewriter";
import { RevealStagger, RevealItem } from "../components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ByTech Software Solutions — Digital Products That Drive Growth" },
      { name: "description", content: "We build modern websites, mobile apps, custom software, and AI systems for ambitious businesses." },
      { property: "og:title", content: "ByTech Software Solutions" },
      { property: "og:description", content: "Premium web, mobile, software & AI development." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const trust = [
  { icon: Code, title: "Modern Development", desc: "Cutting-edge stacks, clean code, future-proof architecture." },
  { icon: Zap, title: "Fast Delivery", desc: "Ship MVPs in weeks, not months — without cutting corners." },
  { icon: Rocket, title: "Scalable Solutions", desc: "Built to grow with your business from day one to millions." },
  { icon: LifeBuoy, title: "Ongoing Support", desc: "Long-term partnerships, monitoring, and continuous iteration." },
];

const services = [
  { icon: Layout, title: "Website Development", desc: "Marketing sites, landing pages, e-commerce, and portfolios." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Flutter & Android apps with Firebase, offline-first, push." },
  { icon: Database, title: "Custom Software", desc: "CRMs, dashboards, internal tools tailored to your workflow." },
  { icon: Brain, title: "AI Solutions", desc: "Chatbots, automation, and LLM integrations done right." },
  { icon: Sparkles, title: "UI/UX Design", desc: "Wireframes, Figma systems, polished modern interfaces." },
  { icon: Shield, title: "Maintenance & Support", desc: "SLA-backed support, security patches, performance tuning." },
];

const projects = [
  { name: "CareerPilot AI", tag: "AI · SaaS", desc: "AI career coach that helps students land their first role." },
  { name: "Bike Showroom MS", tag: "Management", desc: "End-to-end inventory, sales, and service management." },
  { name: "Smart Document Locker", tag: "Security", desc: "Encrypted personal document vault with sharing." },
];

const testimonials = [
  { name: "Ananya R.", role: "Founder, EduSpark", text: "ByTech delivered our MVP in 4 weeks. The quality felt like working with a top-tier agency." },
  { name: "Rohan M.", role: "CTO, FleetIQ", text: "Their attention to architecture and detail saved us months of rework. Highly recommend." },
  { name: "Priya S.", role: "PM, NovaRetail", text: "Clean UI, smooth handoff, and proactive communication throughout. We'll work with them again." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 surface-grid opacity-60" />
        <div className="container-page relative py-24 md:py-36 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Now accepting new projects for Q3
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mx-auto mt-6 max-w-5xl text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-gradient min-h-[2.4em] md:min-h-[2.4em]"
          >
            <Typewriter text="Transforming Ideas Into Powerful Digital Products" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground"
          >
            We build modern websites, mobile applications, custom software solutions, and AI-powered systems for startups, businesses, and entrepreneurs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/contact" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition">
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/portfolio" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition">
              View Our Work
            </Link>
          </motion.div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            {trust.map((t) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-background/70 backdrop-blur p-5 text-left"
              >
                <t.icon className="h-5 w-5 text-foreground" />
                <h3 className="mt-3 text-sm font-semibold">{t.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <Section>
        <div className="container-page">
          <SectionHeader eyebrow="What we do" title="Services that ship outcomes" description="From idea to launch and beyond — full-stack capabilities under one roof." />
          <RevealStagger stagger={0.08} delay={0.1} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem key={s.title}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 transition">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                  <Link to="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </Section>

      {/* PROJECTS */}
      <Section className="bg-surface">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Featured work" title="Selected projects" description="A snapshot of products we've shipped recently." />
            <Link to="/portfolio" className="text-sm font-medium inline-flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <RevealStagger stagger={0.1} delay={0.1} className="mt-12 grid gap-5 md:grid-cols-3">
            {projects.map((p) => (
              <RevealItem key={p.name}>
                <div className="group rounded-2xl border border-border bg-card overflow-hidden h-full transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
                  <div className="aspect-[4/3] relative overflow-hidden" style={{ background: "var(--gradient-brand)" }}>
                    <div className="absolute inset-0 grid place-items-center text-background/90 text-xl font-semibold tracking-tight transition-transform duration-700 group-hover:scale-110">{p.name}</div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-muted-foreground">{p.tag}</span>
                    <h3 className="mt-1 font-semibold">{p.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <div className="container-page">
          <SectionHeader eyebrow="Loved by founders" title="What clients say" center />
          <RevealStagger stagger={0.1} delay={0.1} className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <RevealItem key={t.name}>
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <div className="flex gap-0.5 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                  <p className="mt-4 text-sm text-foreground/90">"{t.text}"</p>
                  <div className="mt-5">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
