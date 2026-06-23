import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="container-page py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <div className="flex items-center gap-2 font-semibold">
            <img src="/logo.png" alt="ByTech Software Solutions" className="h-8 w-auto" />
            ByTech Software Solutions
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Building digital solutions that drive growth — websites, mobile apps, custom software, and AI systems.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) return toast.error("Enter a valid email");
              toast.success("Subscribed. Thanks!");
              setEmail("");
            }}
            className="mt-5 flex max-w-sm overflow-hidden rounded-full border border-border bg-background"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
            />
            <button className="px-4 text-sm font-medium bg-foreground text-background">Subscribe</button>
          </form>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-foreground">Cookie Notice</Link></li>
          </ul>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <a href="https://linkedin.com/in/omkarjadhav1k" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
            <a href="https://github.com/omkarjadhav1k" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
            <a href="mailto:projectbyomkar@gmail.com" aria-label="Email" className="hover:text-foreground"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ByTech Software Solutions. All rights reserved.</p>
          <p>Crafted with care · India</p>
        </div>
      </div>
    </footer>
  );
}
