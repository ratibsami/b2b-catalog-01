import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, CheckCircle, Circle } from "lucide-react";
import { toast } from "sonner";

export default function AdminInquiries() {
  const [filter, setFilter] = useState<"all" | "new" | "read">("all");
  const { data: inquiries, isLoading, refetch } = trpc.inquiries.list.useQuery();

  const updateInquiry = trpc.inquiries.update.useMutation({
    onSuccess: () => {
      toast.success("درخواست به عنوان خوانده شده علامت‌گذاری شد");
      refetch();
    },
  });

  const archiveInquiry = trpc.inquiries.update.useMutation({
    onSuccess: () => {
      toast.success("درخواست با موفقیت بارشیو شد");
      refetch();
    },
    onError: (error: any) => toast.error("خطا: " + error.message),
  });

  const filteredInquiries = inquiries?.filter((inquiry) => {
    if (filter === "new") return inquiry.status === "new";
    if (filter === "read") return inquiry.status === "read";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">درخواست‌های مشتریان</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            همه ({inquiries?.length || 0})
          </Button>
          <Button
            variant={filter === "new" ? "default" : "outline"}
            onClick={() => setFilter("new")}
          >
            جديد ({inquiries?.filter((i) => i.status === "new").length || 0})
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            onClick={() => setFilter("read")}
          >
            خوانده شده ({inquiries?.filter((i) => i.status === "read").length || 0})
          </Button>
        </div>
      </div>

      {/* Inquiries List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      ) : filteredInquiries && filteredInquiries.length > 0 ? (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card
              key={inquiry.id}
              className={`card-soft p-6 ${inquiry.status === "new" ? "border-accent/50 bg-accent/5" : ""}`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => updateInquiry.mutate({ id: inquiry.id, status: inquiry.status === "read" ? "new" : "read" })}
                  className="mt-1 flex-shrink-0"
                >
                  {inquiry.status === "read" ? (
                    <CheckCircle className="h-6 w-6 text-accent" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-accent transition" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{inquiry.senderName}</h3>
                      <p className="text-sm text-muted-foreground">{inquiry.companyName}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                      {inquiry.inquiryType === "product_inquiry"
                        ? "درخواست محصول"
                        : inquiry.inquiryType === "general_contact"
                        ? "تماس عمومی"
                        : "همکاری"}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {inquiry.message}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <a href={`mailto:${inquiry.senderEmail}`} className="hover:text-accent transition">
                      {inquiry.senderEmail}
                    </a>
                    {inquiry.senderPhone && (
                      <a href={`tel:${inquiry.senderPhone}`} className="hover:text-accent transition">
                        {inquiry.senderPhone}
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("آيا مطمئن هستيد؟")) {
                      archiveInquiry.mutate({ id: inquiry.id, status: "archived" });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-soft p-12 text-center">
          <p className="text-muted-foreground">درخواستی یافت نشد</p>
        </Card>
      )}
    </div>
  );
}
