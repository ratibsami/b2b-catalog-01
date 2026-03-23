import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameFa: "",
    descriptionEn: "",
    descriptionFa: "",
    slug: "",
  });

  const { data: categories, isLoading, refetch } = trpc.categories.all.useQuery();
  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
      setFormData({ nameEn: "", nameFa: "", descriptionEn: "", descriptionFa: "", slug: "" });
      setIsCreating(false);
      refetch();
    },
    onError: (error) => toast.error("خطا: " + error.message),
  });

  const deleteCategory = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("دسته‌بندی با موفقیت حذف شد");
      refetch();
    },
    onError: (error) => toast.error("خطا: " + error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.nameFa || !formData.slug) {
      toast.error("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }
    await createCategory.mutateAsync(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="card-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام (انگلیسی)</label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Category Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام (فارسی)</label>
                <Input
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="نام دسته‌بندی"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="category-slug"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">توضیح (انگلیسی)</label>
                <Textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">توضیح (فارسی)</label>
                <Textarea
                  value={formData.descriptionFa}
                  onChange={(e) => setFormData({ ...formData, descriptionFa: e.target.value })}
                  placeholder="توضیح"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ذخیره
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                لغو
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="card-soft p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{category.nameFa}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{category.nameEn}</p>
                  <p className="text-sm text-muted-foreground">{category.descriptionFa}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(category.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("آیا مطمئن هستید؟")) {
                        deleteCategory.mutate({ id: category.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-soft p-12 text-center">
          <p className="text-muted-foreground mb-4">هیچ دسته‌بندی‌ای یافت نشد</p>
          <Button onClick={() => setIsCreating(true)}>دسته‌بندی اول را ایجاد کنید</Button>
        </Card>
      )}
    </div>
  );
}
