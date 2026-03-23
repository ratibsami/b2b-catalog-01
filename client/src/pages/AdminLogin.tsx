import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.adminAuth.login.useMutation({
    onSuccess: () => {
      toast.success("خوش آمدید به پنل ادمین");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error("خطا: " + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    await login.mutateAsync({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <Card className="card-soft w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <Lock className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold mb-2">پنل ادمین</h1>
          <p className="text-muted-foreground">لطفاً وارد شوید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">نام کاربری</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="نام کاربری"
                className="pl-10"
                disabled={login.isPending}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
                className="pl-10"
                disabled={login.isPending}
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

        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            این صفحه فقط برای مدیران سایت است
          </p>
        </div>
      </Card>
    </div>
  );
}
