import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, MessageSquare, BarChart3, AlertCircle } from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  const { data: newInquiriesCount } = trpc.inquiries.newCount.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: allProducts } = trpc.products.all.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: allCategories } = trpc.categories.all.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/");
    }
  }, [isAuthenticated, loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }



  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">داشبورد ادمین</h1>
          <p className="text-muted-foreground mt-2">
            خوش آمدید، {user?.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">محصولات</p>
                <p className="text-3xl font-bold">{allProducts?.length || 0}</p>
              </div>
              <Package className="h-12 w-12 text-accent opacity-50" />
            </div>
          </Card>

          <Card className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">دسته‌بندی‌ها</p>
                <p className="text-3xl font-bold">{allCategories?.length || 0}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-accent opacity-50" />
            </div>
          </Card>

          <Card className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">درخواست‌های جدید</p>
                <p className="text-3xl font-bold">{newInquiriesCount || 0}</p>
              </div>
              <MessageSquare className="h-12 w-12 text-accent opacity-50" />
            </div>
          </Card>

          <Card className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">وضعیت</p>
                <p className="text-3xl font-bold">✓</p>
              </div>
              <AlertCircle className="h-12 w-12 text-green-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="card-soft p-6">
          <h2 className="text-xl font-bold mb-4">اقدامات سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/admin/products">
              <Button variant="outline" className="w-full">
                افزودن محصول
              </Button>
            </a>
            <a href="/admin/categories">
              <Button variant="outline" className="w-full">
                افزودن دسته‌بندی
              </Button>
            </a>
            <a href="/admin/inquiries">
              <Button variant="outline" className="w-full">
                مشاهده درخواست‌ها
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
