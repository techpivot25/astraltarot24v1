import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Eye, Save, Send, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/admin-chrome";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { slugify, uploadBlogImage, type BlogPostRow, type PostStatus } from "@/lib/blog-admin";

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostEditor({ post }: { post?: BlogPostRow }) {
  const navigate = useNavigate();
  const [heading, setHeading] = useState(post?.heading ?? "");
  const [subHeading, setSubHeading] = useState(post?.sub_heading ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [publishAt, setPublishAt] = useState(toLocalInput(post?.publish_date ?? new Date().toISOString()));
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? "");
  const [videoUrl, setVideoUrl] = useState(post?.video_url ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const effectiveSlug = slug || slugify(heading);

  async function save(status: PostStatus, date?: string) {
    if (!heading.trim()) {
      toast.error("Add a heading before saving");
      return;
    }
    setBusy(true);
    const payload = {
      heading: heading.trim(),
      sub_heading: subHeading.trim() || null,
      slug: effectiveSlug || `post-${Date.now()}`,
      content,
      featured_image: featuredImage.trim() || null,
      video_url: videoUrl.trim() || null,
      category: category.trim() || null,
      status,
      publish_date: new Date(date ?? publishAt).toISOString(),
    };
    const { error } = post
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);
    setBusy(false);
    if (error) {
      toast.error("Could not save the post", { description: error.message });
      return;
    }
    const message = status === "draft" ? "Draft saved" : status === "scheduled" ? "Post scheduled" : "Post published";
    toast.success(message);
    navigate({ to: "/admin/dashboard" });
  }

  async function onFeaturedUpload(file: File) {
    try {
      setFeaturedImage(await uploadBlogImage(file));
      toast.success("Featured image uploaded");
    } catch {
      toast.error("Upload failed", { description: "Please try a different image." });
    }
  }

  return (
    <AdminShell
      right={
        <>
          <Button variant="outline" size="sm" onClick={() => setPreview(true)}><Eye className="size-4" /> Preview</Button>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => save("draft")}><Save className="size-4" /> Save Draft</Button>
          <Button variant="outline" size="sm" onClick={() => setScheduling(true)}><CalendarDays className="size-4" /> Schedule</Button>
          <Button size="sm" disabled={busy} onClick={() => save("published", new Date().toISOString())}><Send className="size-4" /> Publish Now</Button>
        </>
      }
    >
      <button onClick={() => navigate({ to: "/admin/dashboard" })} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="heading">Heading</Label>
          <Input
            id="heading"
            placeholder="Enter blog title..."
            className="h-14 text-lg font-semibold"
            value={heading}
            onChange={(e) => { setHeading(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sub">Sub Heading</Label>
          <Input id="sub" placeholder="Enter a brief subtitle..." value={subHeading} onChange={(e) => setSubHeading(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" placeholder="blog-post-url" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} />
          <p className="text-xs text-muted-foreground">/blog/{effectiveSlug || "your-post-url"}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Publish Date</Label>
            <Input id="date" type="datetime-local" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featured">Featured Image</Label>
            <div className="flex gap-2">
              <Input id="featured" placeholder="Image URL or upload" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} />
              <label className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground" title="Upload image">
                <Upload className="size-4" />
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFeaturedUpload(f); }} />
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="video">Video URL (YouTube/Vimeo embed)</Label>
            <div className="flex items-center gap-2">
              <Video className="size-4 text-muted-foreground" />
              <Input id="video" placeholder="https://www.youtube.com/embed/..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat">Category</Label>
            <Input id="cat" placeholder="Tarot Meanings" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
        </div>

        {featuredImage ? <img src={featuredImage} alt="Featured preview" className="w-full rounded-xl border border-border object-cover" /> : null}

        <div className="space-y-2">
          <Label>Blog Content</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>

      <Dialog open={scheduling} onOpenChange={setScheduling}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule this post</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Pick the date and time when the post should go live.</p>
          <Input type="datetime-local" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} />
          <Button disabled={busy} onClick={() => { setScheduling(false); void save("scheduled"); }}>Confirm schedule</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle>{heading || "Untitled post"}</DialogTitle></DialogHeader>
          {subHeading ? <p className="text-muted-foreground">{subHeading}</p> : null}
          {featuredImage ? <img src={featuredImage} alt="" className="w-full rounded-lg" /> : null}
          <div className="admin-prose" dangerouslySetInnerHTML={{ __html: content }} />
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
