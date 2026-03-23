import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Loader2, ImageIcon, X, Play } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const [isCreating, setIsCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
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
    featuredImage: "",
    featuredImageKey: "",
    specifications: "",
  });

  const { data: products, isLoading, refetch } = trpc.products.all.useQuery();
  const { data: categories } = trpc.categories.all.useQuery();
  const uploadMedia = trpc.categories.uploadImage.useMutation();

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
        featuredImage: "",
        featuredImageKey: "",
        specifications: "",
      });
      setImagePreview(null);
      setVideoPreview(null);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingMedia(true);
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          setImagePreview(base64);

          const result = await uploadMedia.mutateAsync({
            filename: file.name,
            base64: base64,
          });

          setFormData({ ...formData, featuredImage: result.url, featuredImageKey: result.key });
          toast.success("تصویر با موفقیت آپلود شد");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("خطا در آپلود تصویر");
      } finally {
        setIsUploadingMedia(false);
      }
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingMedia(true);
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          setVideoPreview(base64);

          const result = await uploadMedia.mutateAsync({
            filename: file.name,
            base64: base64,
          });

          // Video support can be added to specifications JSON
          toast.success("ویدیو با موفقیت آپلود شد");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("خطا در آپلود ویدیو");
      } finally {
        setIsUploadingMedia(false);
      }
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Media Upload Section */}
            <div className="grid grid-cols-2 gap-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-3">تصویر محصول</label>
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">تصویر را انتخاب کنید</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG یا WebP</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploadingMedia}
                      className="hidden"
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border mt-3">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, featuredImage: "", featuredImageKey: "" });
                      }}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video Upload (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-3">ویدیو محصول (اختیاری)</label>
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
                    <div className="text-center">
                      <Play className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">ویدیو را انتخاب کنید</p>
                      <p className="text-xs text-muted-foreground mt-1">MP4 یا WebM</p>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      disabled={isUploadingMedia}
                      className="hidden"
                    />
                  </label>
                </div>
                {videoPreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border mt-3 bg-black flex items-center justify-center">
                    <Play className="h-8 w-8 text-white/50" />
                    <button
                      type="button"
                      onClick={() => {
                  setVideoPreview(null);
                      }}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
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
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام (انگلیسی) *</label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Product Name"
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام (فارسی) *</label>
                <Input
                  value={formData.nameFa}
                  onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                  placeholder="نام محصول"
                  className="h-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="product-slug"
                className="h-10"
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
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">حداقل سفارش</label>
                <Input
                  type="number"
                  value={formData.minOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: parseInt(e.target.value) })}
                  placeholder="1"
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">موجودی</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                  className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground h-10"
                >
                  <option value="in_stock">موجود</option>
                  <option value="out_of_stock">ناموجود</option>
                  <option value="pre_order">پیش‌سفارش</option>
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

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createProduct.isPending} size="lg">
                {createProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ذخیره
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setImagePreview(null);
                  setVideoPreview(null);
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
                    featuredImage: "",
                    featuredImageKey: "",
                    specifications: "",
                  });
                }}
                size="lg"
              >
                لغو
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="card-soft overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              {/* Product Image/Video */}
              <div className="relative w-full h-48 bg-gradient-to-br from-accent/10 to-accent/5 overflow-hidden group">
                {product.featuredImage ? (
                  <>
                    <img
                      src={product.featuredImage}
                      alt={product.nameFa}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {false && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white fill-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-1 line-clamp-2">{product.nameFa}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.nameEn}</p>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                  {product.descriptionFa || product.descriptionEn}
                </p>

                {/* Product Details */}
                <div className="text-sm mb-4 pb-4 border-t border-border/30 pt-3 space-y-1">
                  <p>
                    <span className="font-medium">قیمت:</span> {product.price?.toLocaleString()} تومان
                  </p>
                  <p>
                    <span className="font-medium">موجودی:</span> {product.availability === "in_stock" ? "موجود" : product.availability === "limited" ? "محدود" : "ناموجود"}
                  </p>
                  <p>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.info("ویرایش به زودی فعال خواهد شد")}
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
                        deleteProduct.mutate({ id: product.id });
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
          <p className="text-muted-foreground">هیچ محصولی یافت نشد</p>
        </Card>
      )}
    </div>
  );
}
