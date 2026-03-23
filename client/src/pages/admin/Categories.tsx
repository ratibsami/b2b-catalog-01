import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameFa: "",
    descriptionEn: "",
    descriptionFa: "",
    slug: "",
    bannerUrl: "",
    bannerKey: "",
  });

  const { data: categories, isLoading, refetch } = trpc.categories.all.useQuery();
  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
      setFormData({ nameEn: "", nameFa: "", descriptionEn: "", descriptionFa: "", slug: "", bannerUrl: "", bannerKey: "" });
      setImagePreview(null);
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

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const uploadImage = trpc.categories.uploadImage.useMutation();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingImage(true);
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          setImagePreview(base64);
          
          // Upload to cloud storage
          const result = await uploadImage.mutateAsync({
            filename: file.name,
            base64: base64,
          });
          
          setFormData({ ...formData, bannerUrl: result.url, bannerKey: result.key });
          toast.success("تصویر با موفقیت آپلود شد");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("خطا در آپلود تصویر");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.nameFa || !formData.slug) {
      toast.error("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }
    await createCategory.mutateAsync(formData);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-muted-foreground">دسته‌بندی‌های محصولات خود را مدیریت کنید</p>
        </div>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="gap-2 h-12 px-6"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          دسته‌بندی جدید
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="card-soft p-8 border-2 border-accent/20">
          <h2 className="text-2xl font-bold mb-6">دسته‌بندی جدید</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">تصویر دسته‌بندی</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">تصویر را انتخاب کنید</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG یا WebP</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, bannerUrl: "", bannerKey: "" });
                      }}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام (انگلیسی) *</label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Category Name"
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام (فارسی) *</label>
                <Input
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="نام دسته‌بندی"
                  className="h-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="category-slug"
                className="h-10"
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

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createCategory.isPending} size="lg">
                {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ذخیره
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setImagePreview(null);
                  setFormData({ nameEn: "", nameFa: "", descriptionEn: "", descriptionFa: "", slug: "", bannerUrl: "", bannerKey: "" });
                }}
                size="lg"
              >
                لغو
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="card-soft overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              {/* Category Image */}
              <div className="relative w-full h-48 bg-gradient-to-br from-accent/10 to-accent/5 overflow-hidden">
                {category.bannerUrl ? (
                  <img
                    src={category.bannerUrl}
                    alt={category.nameFa}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1 line-clamp-2">{category.nameFa}</h3>
                <p className="text-sm text-muted-foreground mb-3">{category.nameEn}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {category.descriptionFa || category.descriptionEn}
                </p>
                <div className="text-xs text-muted-foreground/60 mb-4 pb-4 border-t border-border/30">
                  <p className="mt-3">Slug: <span className="font-mono">{category.slug}</span></p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditingId(category.id)}
                  >
                    <Edit2 className="h-4 w-4 ml-2" />
                    ویرایش
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (confirm("آیا مطمئن هستید؟")) {
                        deleteCategory.mutate({ id: category.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-soft p-12 text-center">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground mb-4 text-lg">هیچ دسته‌بندی‌ای یافت نشد</p>
          <Button onClick={() => setIsCreating(true)} size="lg">
            دسته‌بندی اول را ایجاد کنید
          </Button>
        </Card>
      )}
    </div>
  );
}
