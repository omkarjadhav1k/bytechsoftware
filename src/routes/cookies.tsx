import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./privacy";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Notice — ByTech Software Solutions" },
      { name: "description", content: "How ByTech uses cookies on this website." },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => <LegalPage title="Cookie Notice" body="We use a minimal set of cookies to operate this website and understand aggregate usage. You can disable cookies in your browser settings; some site features may not function without them." />,
});
