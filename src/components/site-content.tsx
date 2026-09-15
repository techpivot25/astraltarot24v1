import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import tarotHands from "@/assets/tarot-hands.jpg";
import astrologyWheel from "@/assets/astrology-wheel.jpg";
import onlineReading from "@/assets/online-reading.jpg";

export const services = [
  { title: "One-on-One Tarot Reading", image: tarotHands, price: "₹1,500", duration: "60 minutes", eyebrow: "A deeply personal journey through the cards", desc: "This individual reading offers personal guidance across relationships, career, life purpose, and the questions closest to your heart." },
  { title: "Astrology + Tarot Combined", image: astrologyWheel, price: "₹2,500", duration: "90 minutes", eyebrow: "The cosmos and the cards, together for you", desc: "A layered session blending your birth chart with tarot for cosmic insights into your present path, patterns, and possibilities." },
  { title: "Online Reading", image: onlineReading, price: "From ₹1,200", duration: "45–60 minutes", eyebrow: "Cosmic connection from anywhere", desc: "Connect from anywhere in the world by secure video call and receive the same personal, intuitive guidance from the comfort of home." },
];

export function ServiceCards() {
  return <div className="grid gap-6 md:grid-cols-3">{services.map((service) => <article key={service.title} className="panel group overflow-hidden"><img src={service.image} alt={service.title} width={1200} height={800} loading="lazy" className="h-52 w-full object-cover transition duration-700 group-hover:scale-105" /><div className="p-6"><h3 className="font-display text-xl text-foreground">{service.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{service.desc}</p><div className="mt-5 flex items-center justify-between text-xs uppercase text-primary"><span>{service.duration}</span><span>{service.price}</span></div></div></article>)}</div>;
}

export function CallToAction({ title = "Ready to begin?", copy = "The cards are waiting. Your path is ready to be revealed." }: { title?: string; copy?: string }) {
  return <section className="section-space text-center"><div className="ornament mb-5">✦</div><h2 className="section-title">{title}</h2><p className="mt-3 text-muted-foreground">{copy}</p><Button asChild variant="celestial" className="mt-7"><Link to="/contact">Book your reading</Link></Button></section>;
}