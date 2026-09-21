import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostEditor } from "@/components/admin/post-editor";
import type { BlogPostRow } from "@/lib/blog-admin";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Edit Blog Post | Astral Tarot 24" }, { name: "robots", content: "noindex" }] }),
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as BlogPostRow | null;
    },
  });

  if (isLoading) return <div className="admin-shell grid min-h-screen place-items-center bg-background text-muted-foreground">Loading post…</div>;
  if (!data) return <div className="admin-shell grid min-h-screen place-items-center bg-background text-muted-foreground">This post could not be found.</div>;
  return <PostEditor post={data} />;
}
