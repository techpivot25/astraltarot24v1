import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, SignOutButton } from "@/components/admin/admin-chrome";
import { formatDate } from "@/lib/blog-admin";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Enquiries | Astral Tarot 24" }, { name: "robots", content: "noindex" }] }),
  component: Enquiries,
});

function Enquiries() {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AdminShell right={<SignOutButton />}>
      <button onClick={() => navigate({ to: "/admin/dashboard" })} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to posts
      </button>
      <h1 className="mt-6 text-2xl font-semibold">Leads & Appointment Requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every message sent through the website contact form.</p>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading enquiries…</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No enquiries yet.</p>
        ) : (
          data.map((e) => (
            <article key={e.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold">{e.name}</h2>
                <span className="text-xs text-muted-foreground">{formatDate(e.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {e.email}
                {e.phone ? ` · ${e.phone}` : ""}
              </p>
              {e.reading_type ? <p className="mt-2 text-sm"><strong>Reading:</strong> {e.reading_type}</p> : null}
              {e.preferred_time ? <p className="text-sm"><strong>Preferred time:</strong> {e.preferred_time}</p> : null}
              {e.message ? <p className="mt-2 whitespace-pre-line text-sm">{e.message}</p> : null}
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
