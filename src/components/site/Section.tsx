import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`py-20 md:py-28 ${className}`}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, description, center = false }: { eyebrow?: string; title: string; description?: string; center?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {eyebrow}
        </motion.span>
      )}
      <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-gradient">{title}</h2>
      {description && <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>}
    </motion.div>
  );
}

export function CTABanner() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(14px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 md:p-16"
        >
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(600px 300px at 80% 20%, rgba(120,90,255,0.6), transparent 60%)" }} />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Ready to Build Your Next Digital Product?</h3>
              <p className="mt-3 text-background/70 max-w-xl">Tell us about your idea. We'll respond within one business day with a tailored proposal.</p>
            </div>
            <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-background/90 transition shrink-0">
              Book a Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
