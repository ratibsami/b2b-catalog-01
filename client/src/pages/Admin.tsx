import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminCategories from "./admin/Categories";
import AdminInquiries from "./admin/Inquiries";
import AdminContent from "./admin/Content";
import AdminFAQ from "./admin/FAQ";

export default function Admin() {
  const [location, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { data: sessionData } = trpc.adminAuth.checkSession.useQuery();

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

  // Render different pages based on current location
  const renderPage = () => {
    if (location === "/admin/products") return <AdminProducts />;
    if (location === "/admin/categories") return <AdminCategories />;
    if (location === "/admin/inquiries") return <AdminInquiries />;
    if (location === "/admin/content") return <AdminContent />;
    if (location === "/admin/faq") return <AdminFAQ />;
    return <AdminDashboard />;
  };

  return (
    <DashboardLayout>
      {renderPage()}
    </DashboardLayout>
  );
}
