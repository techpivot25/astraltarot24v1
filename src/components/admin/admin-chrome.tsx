import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, MoonStar } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function AdminBrand() {
  return (
    <span className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
      <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
        <MoonStar className="size-4" />
      </span>
      Astral Tarot 24
    </span>
  );
}

export function AdminShell({ right, children }: { right?: ReactNode; children: ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/admin/dashboard">
            <AdminBrand />
          </Link>
          <div className="flex items-center gap-3 text-sm">{right}</div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}

export function SignOutButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await queryClient.cancelQueries();
        queryClient.clear();
        await supabase.auth.signOut();
        navigate({ to: "/admin/login", replace: true });
      }}
    >
      <LogOut className="size-4" /> Logout
    </Button>
  );
}

export function StatCard({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <span>
        <span className="block text-2xl font-semibold leading-tight">{value}</span>
        <span className="block text-sm text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}
