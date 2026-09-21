import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageIntro } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import { posts as staticPosts, categories } from "@/lib/posts";
import { formatDate } from "@/lib/blog-admin";
import tarotHands from "@/assets/tarot-hands.jpg";

export const Route = createFileRoute("/blog/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "The Astral Journal | Astral Tarot 24" },
      { name: "description", content: "Tarot card meanings, astrology guidance, and spiritual wisdom for everyday life." },
      { property: "og:title", content: "The Astral Journal | Astral Tarot 24" },
      { property: "og:description", content: "Insights and wisdom from Astral Tarot 24." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPage,
});

interface Card {
  slug: string;
  cat: string;
  title: string;
  img: string;
  alt: string;
  text: string;
  date?: string;
}

function BlogPage() {
  const [filter, setFilter] = useState("All");

  const { data: published = [] } = useQuery({
    queryKey: ["published-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, heading, sub_heading, featured_image, category, publish_date, content")
        .eq("status", "published")
        .lte("publish_date", new Date().toISOString())
        .order("publish_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const liveCards: Card[] = published.map((p) => ({
    slug: p.slug,
    cat: p.category ?? "Journal",
    title: p.heading,
    img: p.featured_image ?? tarotHands,
    alt: p.heading,
    text: p.sub_heading ?? p.content.replace(/<[^>]*>/g, " ").slice(0, 150),
    date: formatDate(p.publish_date),
  }));

  const all: Card[] = [...liveCards, ...staticPosts.map((p) => ({ ...p }))];
  const cats = [...new Set([...categories, ...liveCards.map((c) => c.cat)])];
  const visible = filter === "All" ? all : all.filter((p) => p.cat === filter);
  const featured = all[0];

  return (
    <main>
      <PageIntro
        eyebrow="Insights & wisdom"
        title="The Astral Journal"
        copy="Tarot card meanings, astrology guides, and spiritual wisdom to illuminate your everyday path."
      />
      <section className="section-space">
        <div className="mx-auto max-w-5xl px-5">
          {featured && (
            <Link to="/blog/$slug" params={{ slug: featured.slug }} className="panel mb-16 grid overflow-hidden md:grid-cols-2">
              <img src={featured.img} alt={featured.alt} width={1200} height={800} className="h-full min-h-72 w-full object-cover" />
              <div className="flex flex-col justify-center p-8">
                <p className="eyebrow">Featured · {featured.cat}</p>
                <h2 className="mt-4 font-display text-2xl uppercase">{featured.title}</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{featured.text}</p>
                <span className="mt-6 text-sm uppercase text-primary">Read article →</span>
              </div>
            </Link>
          )}

          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 font-display text-[.75rem] uppercase transition ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {visible.map((p) => (
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="panel overflow-hidden" key={p.slug}>
                <div className="relative">
                  <img src={p.img} alt={p.alt} width={1200} height={800} loading="lazy" className="h-40 w-full object-cover opacity-60" />
                  <span className="eyebrow absolute left-4 top-4 rounded bg-background/80 px-2 py-1 text-[.66rem]">{p.cat}</span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground">{p.date ?? "September 15, 2026"} · 6 min read</p>
                  <h2 className="mt-3 font-display text-base uppercase leading-6">{p.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.text}</p>
                  <p className="mt-5 text-xs uppercase text-primary">Read article →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
