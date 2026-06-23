import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./privacy";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ByTech Software Solutions" },
      { name: "description", content: "Terms governing the use of ByTech services." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => <LegalPage title="Terms of Service" body="By accessing or using the ByTech website and services, you agree to these terms. Project scope, deliverables, timelines, and payment terms are governed by individual statements of work. We reserve the right to update these terms; material changes will be communicated to active clients." />,
});
