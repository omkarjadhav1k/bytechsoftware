import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ByTech Software Solutions" },
      { name: "description", content: "How ByTech Software Solutions handles your data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => <LegalPage title="Privacy Policy" body="This page is maintained by ByTech Software Solutions to describe how we handle personal information collected through our website and services. We collect only the information needed to respond to inquiries, deliver services, and operate our business. We do not sell personal data. Contact projectbyomkar@gmail.com for privacy requests including access, correction, and deletion." />,
});

export function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <section className="container-page py-20 md:py-28 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">{title}</h1>
      <p className="mt-6 text-muted-foreground leading-relaxed">{body}</p>
      <p className="mt-6 text-sm text-muted-foreground">Last updated: June 2026</p>
    </section>
  );
}
