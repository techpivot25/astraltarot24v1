import { createFileRoute } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/_authenticated/admin/blog/new")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "New Blog Post | Astral Tarot 24" }, { name: "robots", content: "noindex" }] }),
  component: () => <PostEditor />,
});
