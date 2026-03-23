import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminFAQ() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    questionEn: "",
    questionFa: "",
    answerEn: "",
    answerFa: "",
    category: "general",
  });

  const { data: faqs, isLoading, refetch } = trpc.faqs.list.useQuery();

  const createFAQ = trpc.faqs.create.useMutation({
    onSuccess: () => {
      toast.success("سوال متداول با موفقیت ایجاد شد");
      setFormData({
        questionEn: "",
        questionFa: "",
        answerEn: "",
        answerFa: "",
        category: "general",
      });
      setIsCreating(false);
      refetch();
    },
    onError: (error: any) => toast.error("خطا: " + error.message),
  });

  const deleteFAQ = trpc.faqs.delete.useMutation({
    onSuccess: () => {
      toast.success("سوال متداول با موفقیت حذف شد");
      refetch();
    },
    onError: (error: any) => toast.error("خطا: " + error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionEn || !formData.questionFa || !formData.answerEn || !formData.answerFa) {
      toast.error("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }
    await createFAQ.mutateAsync(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت سوالات متداول</h1>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" />
          سوال جدید
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="card-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">سوال (انگلیسی)</label>
                <Input
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  placeholder="Question in English?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">سوال (فارسی)</label>
                <Input
                  value={formData.questionFa}
                  onChange={(e) => setFormData({ ...formData, questionFa: e.target.value })}
                  placeholder="سوال به فارسی؟"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">پاسخ (انگلیسی)</label>
                <Textarea
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  placeholder="Answer in English"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">پاسخ (فارسی)</label>
                <Textarea
                  value={formData.answerFa}
                  onChange={(e) => setFormData({ ...formData, answerFa: e.target.value })}
                  placeholder="پاسخ به فارسی"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">دسته‌بندی</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground"
              >
                <option value="general">عمومی</option>
                <option value="orders">سفارش‌ها</option>
                <option value="pricing">قیمت‌گذاری</option>
                <option value="payment">پرداخت</option>
                <option value="shipping">ارسال</option>
                <option value="support">پشتیبانی</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createFAQ.isPending}>
                {createFAQ.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ذخیره
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                لغو
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* FAQs List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      ) : faqs && faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map((faq: any) => (
            <Card key={faq.id} className="card-soft p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{faq.questionFa}</h3>
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{faq.questionEn}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">پاسخ (انگلیسی):</p>
                      <p className="text-sm">{faq.answerEn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">پاسخ (فارسی):</p>
                      <p className="text-sm">{faq.answerFa}</p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("آیا مطمئن هستید؟")) {
                      deleteFAQ.mutate({ id: faq.id });
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
          <p className="text-muted-foreground mb-4">هیچ سوالی یافت نشد</p>
          <Button onClick={() => setIsCreating(true)}>سوال اول را ایجاد کنید</Button>
        </Card>
      )}
    </div>
  );
}
