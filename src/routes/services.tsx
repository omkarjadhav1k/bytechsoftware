import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader, CTABanner } from "../components/site/Section";
import { ArrowRight, Check, Layout, Smartphone, Database, Brain, Sparkles } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ByTech Software Solutions" },
      { name: "description", content: "Web development, mobile apps, custom software, AI solutions, and UI/UX design." },
      { property: "og:title", content: "Services — ByTech" },
      { property: "og:description", content: "Web, mobile, software & AI services with transparent pricing." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Layout,
    title: "Website Development",
    features: ["Business websites", "Landing pages", "Portfolio websites", "E-commerce stores"],
    benefits: "Convert visitors into customers with fast, beautiful, SEO-ready sites.",
    price: "From $499",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    features: ["Android apps", "Flutter apps", "Firebase integration", "Push, auth & analytics"],
    benefits: "Cross-platform apps that feel native and ship in weeks.",
    price: "From $1,499",
  },
  {
    icon: Database,
    title: "Custom Software",
    features: ["CRM systems", "Management systems", "Admin dashboards", "Internal tools"],
    benefits: "Automate operations with software designed around your workflow.",
    price: "From $2,499",
  },
  {
    icon: Brain,
    title: "AI Solutions",
    features: ["AI chatbots", "Automation tools", "LLM integrations", "Custom AI workflows"],
    benefits: "Use AI where it matters — to save time, reduce cost, and grow revenue.",
    price: "From $899",
  },
  {
    icon: Sparkles,
    title: "UI/UX Design",
    features: ["Wireframes", "Figma design systems", "Modern interfaces", "Prototyping"],
    benefits: "Designs that look premium and convert visitors to action.",
    price: "From $399",
  },
];

function ServicesPage() {
  return (
    <>
      <Section className="pt-16 md:pt-24 pb-0">
        <div className="container-page">
          <SectionHeader eyebrow="Services" title="End-to-end product development" description="Pick a service or combine them — we'll tailor a plan to your goals and budget." />
        </div>
      </Section>

      <Section>
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-7 flex flex-col">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary"><s.icon className="h-5 w-5" /></div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.benefits}</p>
              <ul className="mt-5 space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 text-foreground" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                <span className="text-sm"><span className="text-muted-foreground">Pricing</span> <span className="font-semibold">{s.price}</span></span>
                <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium">
                  Get a quote <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}
