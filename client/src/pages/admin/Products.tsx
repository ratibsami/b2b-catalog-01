import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: 1,
    nameEn: "",
    nameFa: "",
    descriptionEn: "",
    descriptionFa: "",
    slug: "",
    sku: "",
    price: 0,
    minOrderQuantity: 1,
    availability: "in_stock" as const,
  });

  const { data: products, isLoading, refetch } = trpc.products.all.useQuery();
  const { data: categories } = trpc.categories.all.useQuery();

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("محصول با موفقیت ایجاد شد");
      setFormData({
        categoryId: 1,
        nameEn: "",
        nameFa: "",
        descriptionEn: "",
        descriptionFa: "",
        slug: "",
        sku: "",
        price: 0,
        minOrderQuantity: 1,
        availability: "in_stock",
      });
      setIsCreating(false);
      refetch();
    },
    onError: (error) => toast.error("خطا: " + error.message),
  });

  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("محصول با موفقیت حذف شد");
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
    await createProduct.mutateAsync(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" />
          محصول جدید
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="card-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">دسته‌بندی</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground"
                >
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameFa}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام (انگلیسی)</label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Product Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام (فارسی)</label>
                <Input
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="نام محصول"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="product-slug"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">قیمت</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">حداقل سفارش</label>
                <Input
                  type="number"
                  value={formData.minOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: parseInt(e.target.value) })}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">وضعیت</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                  className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground"
                >
                  <option value="in_stock">موجود</option>
                  <option value="limited">محدود</option>
                  <option value="out_of_stock">ناموجود</option>
                </select>
              </div>
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
              <Button type="submit" disabled={createProduct.isPending}>
                {createProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ذخیره
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                لغو
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      ) : products && products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="card-soft p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{product.nameFa}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.nameEn}</p>
                  <p className="text-sm text-accent font-semibold mb-2">
                    {product.price ? product.price.toLocaleString() : "N/A"} تومان
                  </p>
                  <p className="text-sm text-muted-foreground">{product.descriptionFa}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("آیا مطمئن هستید؟")) {
                        deleteProduct.mutate({ id: product.id });
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
          <p className="text-muted-foreground mb-4">هیچ محصولی یافت نشد</p>
          <Button onClick={() => setIsCreating(true)}>محصول اول را ایجاد کنید</Button>
        </Card>
      )}
    </div>
  );
}
