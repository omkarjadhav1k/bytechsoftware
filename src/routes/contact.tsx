import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader } from "../components/site/Section";
import { Mail, Linkedin, Github, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "../integrations/supabase/client";
import { createServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ByTech Software Solutions" },
      { name: "description", content: "Get in touch to discuss your project. We respond within one business day." },
      { property: "og:title", content: "Contact — ByTech" },
      { property: "og:description", content: "Start a project with ByTech Software Solutions." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  projectType: z.string().max(60).optional().or(z.literal("")),
  budget: z.string().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
});

const sendWhatsAppNotification = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }: { data: any }) => {
    const apiKey = process.env.CALLMEBOT_API_KEY || import.meta.env.CALLMEBOT_API_KEY;
    if (!apiKey) {
      console.warn("[WhatsApp Notification] CALLMEBOT_API_KEY is not defined in environment variables.");
      return { success: false, error: "API key missing" };
    }

    const text = `*New Lead Details*\n\n` +
                 `• *Name:* ${data.name}\n` +
                 `• *Email:* ${data.email}\n` +
                 `• *Phone:* ${data.phone || "N/A"}\n` +
                 `• *Project:* ${data.projectType}\n` +
                 `• *Budget:* ${data.budget}\n` +
                 `• *Message:* ${data.message}`;

    const phone = "919699779276";
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`CallMeBot responded with status: ${res.status}`);
      }
      return { success: true };
    } catch (err: any) {
      console.error("Failed to send WhatsApp message via CallMeBot:", err);
      return { success: false, error: err.message };
    }
  });

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", projectType: "Website", budget: "$1k–$5k", message: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      // 1. Save to Supabase DB
      const { error } = await supabase.from("contacts").insert([
        {
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          project_type: form.projectType || null,
          budget: form.budget || null,
          message: form.message,
        },
      ]);
      if (error) throw error;

      // 2. Send background WhatsApp notification via server function
      const notifyResult = await sendWhatsAppNotification({ data: form });
      if (notifyResult.success) {
        toast.success("Message sent! You will receive a WhatsApp message shortly.");
      } else {
        // Fallback if API key is not configured yet
        toast.success("Thanks! Message saved successfully.");
        console.warn("Background notification failed:", notifyResult.error);
      }
      
      setForm({ name: "", email: "", phone: "", projectType: "Website", budget: "$1k–$5k", message: "" });
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className="pt-16 md:pt-24">
      <div className="container-page">
        <SectionHeader eyebrow="Contact" title="Let's build something great" description="Tell us about your project. We'll reply within one business day with a tailored proposal." />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name"><input required value={form.name} onChange={update("name")} className="input" placeholder="Your name" /></Field>
              <Field label="Email"><input required type="email" value={form.email} onChange={update("email")} className="input" placeholder="you@company.com" /></Field>
              <Field label="Phone"><input value={form.phone} onChange={update("phone")} className="input" placeholder="+91 ..." /></Field>
              <Field label="Project Type">
                <select value={form.projectType} onChange={update("projectType")} className="input">
                  <option>Website</option><option>Mobile App</option><option>Custom Software</option><option>AI Solution</option><option>UI/UX Design</option><option>Other</option>
                </select>
              </Field>
              <Field label="Budget">
                <select value={form.budget} onChange={update("budget")} className="input sm:col-span-2">
                  <option>Under $1k</option><option>$1k–$5k</option><option>$5k–$15k</option><option>$15k+</option>
                </select>
              </Field>
            </div>
            <Field label="Message">
              <textarea required rows={5} value={form.message} onChange={update("message")} className="input resize-y" placeholder="Tell us about your project, goals, and timeline." />
            </Field>
            <button disabled={submitting} className="inline-flex w-full sm:w-auto justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium disabled:opacity-60">
              {submitting ? "Sending..." : "Send Message"}
            </button>
            <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:0.75rem;padding:0.7rem 0.9rem;font-size:0.875rem;outline:none;transition:border-color .15s} .input:focus{border-color:var(--foreground)}`}</style>
          </form>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">Reach us directly</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3"><Mail className="h-4 w-4" /> projectbyomkar@gmail.com</li>
                <li className="flex items-center gap-3"><Phone className="h-4 w-4" /> <a href="https://wa.me/919699779276" className="hover:underline" target="_blank" rel="noreferrer">+91 9699779276</a></li>
                <li className="flex items-center gap-3"><MapPin className="h-4 w-4" /> Maharashtra, India</li>
                <li className="flex items-center gap-3"><Linkedin className="h-4 w-4" /> <a href="https://linkedin.com/in/omkarjadhav1k" className="hover:underline" target="_blank" rel="noreferrer">linkedin.com/in/omkarjadhav1k</a></li>
                <li className="flex items-center gap-3"><Github className="h-4 w-4" /> <a href="https://github.com/omkarjadhav1k" className="hover:underline" target="_blank" rel="noreferrer">github.com/omkarjadhav1k</a></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-[4/3] bg-muted relative">
                <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Map placeholder</div>
              </div>
              <div className="p-4 text-sm text-muted-foreground">We work remotely with clients worldwide.</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
