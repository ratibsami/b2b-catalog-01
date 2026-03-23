import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  LogOut,
  Lock,
  Loader2,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminCategories from "./admin/Categories";
import AdminInquiries from "./admin/Inquiries";
import AdminContent from "./admin/Content";
import AdminFAQ from "./admin/FAQ";
import AdminSettings from "./admin/Settings";

export default function AdminSimple() {
  const [location, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: logoSetting } = trpc.settings.get.useQuery({ key: "logo_url" });
  const logoUrl = logoSetting?.value || "https://d2xsxph8kpxj0f.cloudfront.net/310519663355544748/YE3BoRZtdDkUr36qDCVcUW/savin-logo_41b96128.svg";

  // Check if user has admin session in localStorage
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem("adminSession");
      setIsAuthenticated(false);
      setPassword("");
      toast.success("خروج موفق");
      navigate("/");
    },
  });

  const loginMutation = trpc.adminAuth.login.useMutation({
    onSuccess: (result) => {
      localStorage.setItem("adminSession", result.token);
      setIsAuthenticated(true);
      setPassword("");
      toast.success("ورود موفق");
    },
    onError: () => {
      toast.error("رمز عبور نادرست است");
      setPassword("");
    },
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("لطفاً رمز عبور را وارد کنید");
      return;
    }

    setIsVerifying(true);
    await loginMutation.mutateAsync({ password });
    setIsVerifying(false);
  };

  const handleLogout = () => {
    logout.mutate();
  };

  const navItems = [
    { label: "داشبورد", path: "/admin", icon: LayoutDashboard },
    { label: "محصولات", path: "/admin/products", icon: Package },
    { label: "دسته‌بندی‌ها", path: "/admin/categories", icon: Layers },
    { label: "درخواست‌ها", path: "/admin/inquiries", icon: MessageSquare },
    { label: "محتوا", path: "/admin/content", icon: FileText },
    { label: "سوالات متداول", path: "/admin/faq", icon: HelpCircle },
    { label: "تنظیمات", path: "/admin/settings", icon: Settings },
  ];

  // Render different pages based on current location
  const renderPage = () => {
    if (location.startsWith("/admin/products")) return <AdminProducts />;
    if (location.startsWith("/admin/categories")) return <AdminCategories />;
    if (location.startsWith("/admin/inquiries")) return <AdminInquiries />;
    if (location.startsWith("/admin/content")) return <AdminContent />;
    if (location.startsWith("/admin/faq")) return <AdminFAQ />;
    if (location.startsWith("/admin/settings")) return <AdminSettings />;
    return <AdminDashboard />;
  };

  // Password Protection Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src={logoUrl} alt="Savin Global Trade" className="h-16 w-16" />
              </div>
              <h1 className="text-2xl font-bold gradient-text mb-2">Savin Global Trade</h1>
              <p className="text-sm text-muted-foreground mb-2">پنل مديريت</p>
              <p className="text-sm text-muted-foreground">لطفاً رمز عبور را وارد کنید</p>
            </div>

            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">رمز عبور</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور را وارد کنید"
                  disabled={isVerifying}
                  className="h-11 text-lg"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isVerifying || !password.trim() || loginMutation.isPending}
                className="w-full h-11 text-base"
              >
                {(isVerifying || loginMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isVerifying || loginMutation.isPending ? "در حال تحقق..." : "ورود"}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                این پنل محدود به مدیران است. دسترسی غیرمجاز ممنوع است.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-6 h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <img src={logoUrl} alt="Savin Global Trade" className="h-8 w-8" />
          <h2 className="text-lg font-bold gradient-text">Savin</h2>
        </div>

        <nav className="space-y-2 mb-8">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/10 text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />
          خروج
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
