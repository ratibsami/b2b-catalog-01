import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminCategories from "./admin/Categories";
import AdminInquiries from "./admin/Inquiries";
import AdminContent from "./admin/Content";
import AdminFAQ from "./admin/FAQ";

export default function AdminSimple() {
  const [location, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { data: sessionData } = trpc.adminAuth.checkSession.useQuery();

  const logout = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      toast.success("خروج موفق");
      navigate("/admin/login");
    },
  });

  useEffect(() => {
    setIsLoading(false);
  }, [sessionData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!sessionData?.isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  const navItems = [
    { label: "داشبورد", path: "/admin", icon: LayoutDashboard },
    { label: "محصولات", path: "/admin/products", icon: Package },
    { label: "دسته‌بندی‌ها", path: "/admin/categories", icon: Layers },
    { label: "درخواست‌ها", path: "/admin/inquiries", icon: MessageSquare },
    { label: "محتوا", path: "/admin/content", icon: FileText },
    { label: "سوالات متداول", path: "/admin/faq", icon: HelpCircle },
  ];

  // Render different pages based on current location
  const renderPage = () => {
    if (location.startsWith("/admin/products")) return <AdminProducts />;
    if (location.startsWith("/admin/categories")) return <AdminCategories />;
    if (location.startsWith("/admin/inquiries")) return <AdminInquiries />;
    if (location.startsWith("/admin/content")) return <AdminContent />;
    if (location.startsWith("/admin/faq")) return <AdminFAQ />;
    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-6 h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-xl font-bold gradient-text mb-6">پنل ادمین</h2>

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

        <div className="border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout.mutateAsync()}
            disabled={logout.isPending}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            خروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
