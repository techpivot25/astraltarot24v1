import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { posts as staticPosts } from "@/lib/posts";
import { deviceLabel, formatDate, type BlogPostRow } from "@/lib/blog-admin";
import { CallToAction } from "@/components/site-content";

export const Route = createFileRoute("/blog/$slug")({
  staticData: { sitemap: true },
  head: ({ params }) => {
    const post = staticPosts.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: `${post?.title ?? "Article"} | Astral Tarot 24` },
        { name: "description", content: post?.text ?? "An article from The Astral Journal by Astral Tarot 24." },
        { property: "og:title", content: post?.title ?? "The Astral Journal" },
        { property: "og:description", content: post?.text ?? "Tarot and astrology insights from Astral Tarot 24." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <main className="section-space mx-auto max-w-2xl px-5 text-center">
      <h1 className="section-title">Article not found</h1>
      <p className="mt-4 text-muted-foreground">This article may have moved or is not published yet.</p>
      <Link to="/blog" className="mt-6 inline-block text-sm uppercase text-primary">← Back to the journal</Link>
    </main>
  ),
  errorComponent: () => (
    <main className="section-space mx-auto max-w-2xl px-5 text-center">
      <h1 className="section-title">This article didn't load</h1>
      <Link to="/blog" className="mt-6 inline-block text-sm uppercase text-primary">← Back to the journal</Link>
    </main>
  ),
});

function PostPage() {
  const { slug } = Route.useParams();
  const staticPost = staticPosts.find((p) => p.slug === slug);

  const { data: livePost, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .lte("publish_date", new Date().toISOString())
        .maybeSingle();
      if (error) throw error;
      return (data as BlogPostRow | null) ?? null;
    },
  });

  useEffect(() => {
    if (!livePost) return;
    void supabase.from("blog_post_views").insert({
      post_id: livePost.id,
      device: deviceLabel(),
      country: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : null,
    });
  }, [livePost]);

  if (!livePost && !staticPost) {
    if (isLoading) return <main className="section-space px-5 text-center text-muted-foreground">Loading article…</main>;
    throw notFound();
  }

  const title = livePost?.heading ?? staticPost!.title;
  const sub = livePost?.sub_heading ?? staticPost!.text;
  const image = livePost?.featured_image ?? staticPost!.img;
  const category = livePost?.category ?? staticPost!.cat;
  const date = livePost ? formatDate(livePost.publish_date) : "September 15, 2026";

  return (
    <main>
      <article className="section-space mx-auto max-w-3xl px-5">
        <p className="eyebrow">{category}</p>
        <h1 className="hero-title mt-4 text-3xl md:text-4xl">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{date} · 6 min read</p>
        <img src={image} alt={livePost ? title : staticPost!.alt} className="mt-8 w-full rounded-lg border border-border object-cover" />
        {sub && <p className="mt-8 text-lg leading-8 text-muted-foreground">{sub}</p>}

        {livePost?.video_url && (
          <div className="mt-8 aspect-video overflow-hidden rounded-lg border border-border">
            <iframe src={livePost.video_url} title={title} allowFullScreen className="size-full" />
          </div>
        )}

        {livePost ? (
          <div className="admin-prose mt-8 leading-8 text-muted-foreground" dangerouslySetInnerHTML={{ __html: livePost.content }} />
        ) : (
          <div className="mt-8 space-y-6 leading-8 text-muted-foreground">
            {staticPost!.body.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
          </div>
        )}

        <Link to="/blog" className="mt-12 inline-block text-sm uppercase text-primary">← Back to the journal</Link>
      </article>
      <CallToAction />
    </main>
  );
}
