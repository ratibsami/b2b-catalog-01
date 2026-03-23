import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, MessageSquare, BarChart3, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: newInquiriesCount } = trpc.inquiries.newCount.useQuery();
  const { data: allProducts } = trpc.products.all.useQuery();
  const { data: allCategories } = trpc.categories.all.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">داشبورد ادمین</h1>
        <p className="text-muted-foreground mt-2">خوش آمدید به پنل مدیریت</p>
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
          <Link href="/admin/products">
            <Button variant="outline" className="w-full">
              افزودن محصول
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline" className="w-full">
              افزودن دسته‌بندی
            </Button>
          </Link>
          <Link href="/admin/inquiries">
            <Button variant="outline" className="w-full">
              مشاهده درخواست‌ها
            </Button>
          </Link>
        </div>
      </Card>

      {/* Navigation */}
      <Card className="card-soft p-6">
        <h2 className="text-xl font-bold mb-4">بخش‌های مدیریت</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/products">
            <Button variant="outline" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              مدیریت محصولات
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              مدیریت دسته‌بندی‌ها
            </Button>
          </Link>
          <Link href="/admin/inquiries">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              درخواست‌های مشتریان
            </Button>
          </Link>
          <Link href="/admin/content">
            <Button variant="outline" className="w-full justify-start">
              مدیریت محتوا
            </Button>
          </Link>
          <Link href="/admin/faq">
            <Button variant="outline" className="w-full justify-start">
              سوالات متداول
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
