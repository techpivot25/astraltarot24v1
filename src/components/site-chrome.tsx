import { Link } from "@tanstack/react-router";
import { Menu, MoonStar, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/about", "About"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
] as const;

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-sm text-primary">
      <span className="grid size-8 place-items-center rounded-full border border-primary/30 bg-primary/10">
        <MoonStar className="size-4" />
      </span>
      <span>Astral Tarot 24</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Brand />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {links.map(([to, label]) => (
            <Link key={to} to={to} activeProps={{ className: "text-primary" }} className="nav-link">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild variant="celestial" size="sm"><Link to="/contact">Book a reading</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-5 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            {links.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="nav-link text-base">{label}</Link>)}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-deep py-12">
      <div className="ornament mb-10">✦ &nbsp; ✦ &nbsp; ✦</div>
      <div className="mx-auto grid max-w-5xl gap-10 px-5 md:grid-cols-4">
        <div><Brand /><p className="mt-5 text-sm leading-7 text-muted-foreground">Illuminating your path through the ancient wisdom of tarot and the cosmic language of astrology.</p></div>
        <FooterList title="Services" items={["Tarot Card Reading", "Astrology + Tarot", "Online Reading", "Past Life Analysis"]} />
        <FooterList title="Navigate" items={["Home", "About", "Blog", "Contact"]} />
        <div><p className="eyebrow">Connect</p><p className="mt-4 text-sm leading-7 text-muted-foreground">WhatsApp<br />+91 99998 36364<br /><br />Email<br />support@astraltarot24.in<br /><br />Mon–Fri, 11am–6pm IST</p></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-5xl flex-col justify-between gap-3 border-t border-border px-5 pt-6 text-xs text-muted-foreground sm:flex-row"><span>© 2026 Astral Tarot 24. All rights reserved.</span><span>Privacy Policy &nbsp;&nbsp; Terms of Service</span></div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return <div><p className="eyebrow">{title}</p><ul className="mt-4 space-y-3 text-sm text-muted-foreground">{items.map((i) => <li key={i}>✦ &nbsp;{i}</li>)}</ul></div>;
}

export function SectionHeading({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) {
  return <div className="mx-auto mb-12 max-w-2xl text-center">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="section-title mt-3">{title}</h2>{copy && <p className="mt-4 text-muted-foreground">{copy}</p>}</div>;
}

export function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="page-intro"><div className="mx-auto max-w-3xl px-5 text-center animate-rise"><p className="eyebrow">{eyebrow}</p><h1 className="hero-title mt-4">{title}</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">{copy}</p></div></section>;
}

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  return (
    <form className="panel grid gap-4 p-6 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <Field label="Your name"><input placeholder="Enter your name" /></Field>
      <Field label="Email address"><input type="email" placeholder="you@email.com" /></Field>
      <Field label="WhatsApp / phone"><input placeholder="+91 00000 00000" /></Field>
      <Field label="Type of reading"><select defaultValue=""><option value="" disabled>Select a reading...</option><option>One-on-one tarot reading</option><option>Astrology + tarot combined</option><option>Online reading</option></select></Field>
      {!compact && <div className="md:col-span-2"><Field label="Preferred date & time"><input placeholder="e.g. Weekday evening, Saturday morning IST" /></Field></div>}
      <div className="md:col-span-2"><Field label="Your message"><textarea rows={compact ? 3 : 4} placeholder="Share what's on your heart — what guidance are you seeking?" /></Field></div>
      <Button variant="celestial" className="md:col-span-2">Send my {compact ? "message" : "enquiry"}</Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2"><span className="eyebrow text-[0.6rem]">{label}</span>{children}</label>;
}