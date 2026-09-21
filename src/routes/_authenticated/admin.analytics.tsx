import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Download, Eye, FileText, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, SignOutButton, StatCard } from "@/components/admin/admin-chrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Blog Analytics | Astral Tarot 24" }, { name: "robots", content: "noindex" }] }),
  component: Analytics,
});

const RANGES = [
  ["7d", 7],
  ["30d", 30],
  ["90d", 90],
] as const;

function Analytics() {
  const navigate = useNavigate();
  const [days, setDays] = useState<number>(7);

  const { data } = useQuery({
    queryKey: ["analytics", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 864e5).toISOString();
      const [viewsRes, postsRes] = await Promise.all([
        supabase.from("blog_post_views").select("post_id, viewed_at, country, device").gte("viewed_at", since),
        supabase.from("blog_posts").select("id, heading, status"),
      ]);
      if (viewsRes.error) throw viewsRes.error;
      if (postsRes.error) throw postsRes.error;
      return { views: viewsRes.data ?? [], posts: postsRes.data ?? [] };
    },
  });

  const views = data?.views ?? [];
  const posts = data?.posts ?? [];

  const tally = (key: "country" | "device") => {
    const map = new Map<string, number>();
    for (const v of views) map.set(v[key] ?? "Unknown", (map.get(v[key] ?? "Unknown") ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  };

  const byPost = () => {
    const map = new Map<string, number>();
    for (const v of views) map.set(v.post_id, (map.get(v.post_id) ?? 0) + 1);
    return posts
      .map((p) => ({ heading: p.heading, count: map.get(p.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const timeline = () => {
    const buckets = new Map<string, number>();
    for (let i = days - 1; i >= 0; i -= 1) {
      buckets.set(new Date(Date.now() - i * 864e5).toISOString().slice(0, 10), 0);
    }
    for (const v of views) {
      const key = v.viewed_at.slice(0, 10);
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return [...buckets.entries()];
  };

  const series = timeline();
  const peak = Math.max(1, ...series.map(([, n]) => n));

  function exportCsv() {
    const rows = [["Post", "Views"], ...byPost().map((r) => [r.heading, String(r.count)])];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-analytics-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell right={<SignOutButton />}>
      <button onClick={() => navigate({ to: "/admin/dashboard" })} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to posts
      </button>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">How your readers are finding and reading your posts.</p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map(([label, value]) => (
            <Button key={label} size="sm" variant={days === value ? "default" : "outline"} onClick={() => setDays(value)}>
              {label}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}><Download className="size-4" /> CSV</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Eye className="size-5" />} value={views.length} label="Total Views" />
        <StatCard icon={<Globe className="size-5" />} value={tally("country").length} label="Countries" />
        <StatCard icon={<FileText className="size-5" />} value={posts.filter((p) => p.status === "published").length} label="Active Posts" />
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Views Over Time</h2>
        <div className="mt-6 flex h-40 items-end gap-1">
          {series.map(([date, count]) => (
            <div key={date} className="flex-1" title={`${date}: ${count} views`}>
              <div className="rounded-t bg-primary/70" style={{ height: `${(count / peak) * 140}px`, minHeight: "2px" }} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Last {days} days</p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <ListCard title="Top Performing Posts" rows={byPost().map((r) => [r.heading, r.count])} empty="No views recorded yet." />
        <ListCard title="Top Locations" rows={tally("country").slice(0, 5)} empty="No locations yet." />
        <ListCard title="Devices" rows={tally("device").slice(0, 5)} empty="No devices yet." />
      </div>
    </AdminShell>
  );
}

function ListCard({ title, rows, empty }: { title: string; rows: Array<[string, number]>; empty: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3 text-sm">
          {rows.map(([label, count]) => (
            <li key={label} className="flex items-center justify-between gap-3">
              <span className="truncate">{label}</span>
              <span className="shrink-0 font-medium text-muted-foreground">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
