import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { toast } from "sonner";

interface NavItem {
  label: string;
  path: string;
  icon: any;
}

const navItems: NavItem[] = [
  { label: "داشبورد", path: "/admin", icon: LayoutDashboard },
  { label: "محصولات", path: "/admin/products", icon: Package },
  { label: "دسته‌بندی‌ها", path: "/admin/categories", icon: Layers },
  { label: "درخواست‌ها", path: "/admin/inquiries", icon: MessageSquare },
  { label: "محتوا", path: "/admin/content", icon: FileText },
  { label: "سوالات متداول", path: "/admin/faq", icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const logout = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      toast.success("خروج موفق");
      navigate("/admin/login");
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 h-screen bg-card border-l border-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold gradient-text">پنل ادمین</h2>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }}
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            خروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground">
              پنل مدیریت
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
