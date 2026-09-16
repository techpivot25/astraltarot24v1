import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminBrand } from "@/components/admin/admin-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Admin Login | Astral Tarot 24" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("astratarot24@gmail.com");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/dashboard", replace: true });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error("Sign in failed", { description: "Check the email address and password and try again." });
      return;
    }
    toast.success("Login successful", { description: "Welcome to the admin dashboard." });
    navigate({ to: "/admin/dashboard", replace: true });
  }

  return (
    <div className="admin-shell grid min-h-screen place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <AdminBrand />
        </div>
        <div className="mt-8 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-6" />
          </span>
        </div>
        <h1 className="mt-5 text-center text-2xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to access the CMS dashboard</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
