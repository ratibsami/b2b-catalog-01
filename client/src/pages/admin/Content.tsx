import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminContent() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    contentEn: "",
    contentFa: "",
  });

  const { data: contents, isLoading, refetch } = trpc.content.all.useQuery();

  const createContent = trpc.content.create.useMutation({
    onSuccess: () => {
      toast.success("محتوا با موفقیت ایجاد شد");
      setFormData({ key: "", contentEn: "", contentFa: "" });
      setIsCreating(false);
      refetch();
    },
    onError: (error: any) => toast.error("خطا: " + error.message),
  });

  const updateContent = trpc.content.update.useMutation({
    onSuccess: () => {
      toast.success("محتوا با موفقیت به‌روزرسانی شد");
      setEditingId(null);
      refetch();
    },
    onError: (error: any) => toast.error("خطا: " + error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key || !formData.contentEn || !formData.contentFa) {
      toast.error("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    if (editingId) {
      await updateContent.mutateAsync({ id: editingId, ...formData });
    } else {
      await createContent.mutateAsync(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت محتوا</h1>
        <Button
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingId(null);
            setFormData({ key: "", contentEn: "", contentFa: "" });
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          محتوای جدید
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="card-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">کلید</label>
              <Input
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="content_key"
                disabled={!!editingId}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">محتوا (انگلیسی)</label>
                <Textarea
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Content in English"
                  rows={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">محتوا (فارسی)</label>
                <Textarea
                  value={formData.contentFa}
                  onChange={(e) => setFormData({ ...formData, contentFa: e.target.value })}
                  placeholder="محتوا به فارسی"
                  rows={5}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createContent.isPending || updateContent.isPending}>
                {(createContent.isPending || updateContent.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingId ? "به‌روزرسانی" : "ذخیره"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setFormData({ key: "", contentEn: "", contentFa: "" });
                }}
              >
                لغو
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Contents List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      ) : contents && contents.length > 0 ? (
        <div className="space-y-4">
          {contents.map((content: any) => (
            <Card key={content.id} className="card-soft p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{content.key}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">انگلیسی:</p>
                      <p className="text-sm">{content.contentEn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">فارسی:</p>
                      <p className="text-sm">{content.contentFa}</p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(content.id);
                    setIsCreating(false);
                    setFormData({
                      key: content.key,
                      contentEn: content.contentEn,
                      contentFa: content.contentFa,
                    });
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-soft p-12 text-center">
          <p className="text-muted-foreground mb-4">هیچ محتوایی یافت نشد</p>
          <Button onClick={() => setIsCreating(true)}>محتوای اول را ایجاد کنید</Button>
        </Card>
      )}
    </div>
  );
}
