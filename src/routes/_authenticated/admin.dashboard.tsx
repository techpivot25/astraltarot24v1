import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Eye, FileText, Pencil, Plus, Send, Trash2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, SignOutButton, StatCard } from "@/components/admin/admin-chrome";
import { Button } from "@/components/ui/button";
import { formatDate, type BlogPostRow } from "@/lib/blog-admin";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Blog Dashboard | Astral Tarot 24" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

const statusStyle: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
  draft: "bg-muted text-muted-foreground",
};

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("publish_date", { ascending: false });
      if (error) throw error;
      return data as BlogPostRow[];
    },
  });

  const { data: views = 0 } = useQuery({
    queryKey: ["admin-views-7d"],
    queryFn: async () => {
      const since = new Date(Date.now() - 7 * 864e5).toISOString();
      const { count, error } = await supabase
        .from("blog_post_views")
        .select("id", { count: "exact", head: true })
        .gte("viewed_at", since);
      if (error) throw error;
      return count ?? 0;
    },
  });

  async function remove(post: BlogPostRow) {
    if (!window.confirm(`Delete “${post.heading}”? This cannot be undone.`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (error) {
      toast.error("Could not delete the post", { description: error.message });
      return;
    }
    toast.success("Post deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
  }

  async function publishNow(post: BlogPostRow) {
    const { error } = await supabase
      .from("blog_posts")
      .update({ status: "published", publish_date: new Date().toISOString() })
      .eq("id", post.id);
    if (error) {
      toast.error("Could not publish the post", { description: error.message });
      return;
    }
    toast.success("Post published");
    queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
  }

  return (
    <AdminShell
      right={
        <>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/admin/enquiries" })}>
            <Inbox className="size-4" /> Enquiries
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/admin/analytics" })}>
            <BarChart3 className="size-4" /> Analytics
          </Button>
          <Button size="sm" onClick={() => navigate({ to: "/admin/blog/new" })}>
            <Plus className="size-4" /> New Post
          </Button>
          <SignOutButton />
        </>
      }
    >
      <h1 className="text-2xl font-semibold">Blog Posts</h1>
      <p className="mt-1 text-sm text-muted-foreground">Create, schedule, and manage your blog articles.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FileText className="size-5" />} value={posts.length} label="Total Posts" />
        <StatCard icon={<Send className="size-5" />} value={posts.filter((p) => p.status === "published").length} label="Published" />
        <StatCard icon={<CalendarClock className="size-5" />} value={posts.filter((p) => p.status === "scheduled").length} label="Scheduled" />
        <StatCard icon={<Eye className="size-5" />} value={views} label="Views (7d)" />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">Loading posts…</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No posts yet. Create your first one.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <span className="block font-medium">{post.heading}</span>
                    <span className="block text-xs text-muted-foreground">/blog/{post.slug}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle[post.status]}`}>{post.status}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(post.publish_date)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Link to="/blog/$slug" params={{ slug: post.slug }} title="View post" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Eye className="size-4" />
                      </Link>
                      <Link to="/admin/blog/$id" params={{ id: post.id }} title="Edit post" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="size-4" />
                      </Link>
                      {post.status !== "published" && (
                        <button onClick={() => void publishNow(post)} title="Publish now" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                          <Send className="size-4" />
                        </button>
                      )}
                      <button onClick={() => void remove(post)} title="Delete post" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
