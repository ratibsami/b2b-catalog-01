import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const utils = trpc.useUtils();

  const login = trpc.adminAuth.login.useMutation({
    onSuccess: async () => {
      // Immediately invalidate and navigate
      await utils.adminAuth.checkSession.invalidate();
      toast.success("خوش آمدید به پنل ادمین");
      // Navigate immediately without delay
      navigate("/admin");
    },
    onError: (error) => {
      toast.error("خطا: " + error.message);
      setPassword("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("لطفاً رمز عبور را وارد کنید");
      return;
    }
    await login.mutateAsync({ password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <Lock className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold mb-2">پنل ادمین</h1>
          <p className="text-muted-foreground">رمز عبور را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
          <div>
            <label className="block text-sm font-medium mb-2">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور را وارد کنید"
                className="pl-10 pr-4"
                disabled={login.isPending}
                autoFocus
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending}
            size="lg"
          >
            {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ورود
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            این صفحه فقط برای مدیران سایت است
          </p>
        </div>
      </div>
    </div>
  );
}
