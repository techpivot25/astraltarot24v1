import { supabase } from "@/integrations/supabase/client";

export type PostStatus = "draft" | "scheduled" | "published";

export interface BlogPostRow {
  id: string;
  heading: string;
  sub_heading: string | null;
  slug: string;
  content: string;
  featured_image: string | null;
  video_url: string | null;
  category: string | null;
  status: PostStatus;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads an image to the blog-images bucket and returns a long-lived URL. */
export async function uploadBlogImage(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("blog-images").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("blog-images")
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw signError ?? new Error("Could not create image link");
  return data.signedUrl;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function readingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function deviceLabel() {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
  return "Desktop";
}
