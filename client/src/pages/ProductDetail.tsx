import { useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, MessageSquare, Phone, Mail, Share2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: product, isLoading } = trpc.products.bySlug.useQuery({ slug });
  const { data: images } = trpc.productImages.list.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );

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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">محصول یافت نشد</h1>
            <Link href="/catalog">
              <Button>بازگشت به کاتالوگ</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrls = (images || []).map((img) => img.imageUrl);
  const allImages = product.featuredImage ? [product.featuredImage, ...imageUrls] : imageUrls;
  const displayImage = selectedImage || product.featuredImage;

  const specifications = product.specifications ? JSON.parse(product.specifications) : {};

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-card/30 py-4">
        <div className="container flex items-center gap-2">
          <Link href="/" className="text-muted-foreground hover:text-accent transition">
            خانه
          </Link>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/catalog" className="text-muted-foreground hover:text-accent transition">
            کاتالوگ
          </Link>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{product.nameFa}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images */}
            <div className="lg:col-span-2">
              <Card className="card-soft p-4 mb-4">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={product.nameFa}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">بدون تصویر</span>
                  </div>
                )}
              </Card>

              {/* Image Thumbnails */}
              {allImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        displayImage === img ? "border-accent" : "border-border/50"
                      }`}
                    >
                      <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.nameFa}</h1>
              <p className="text-muted-foreground mb-6">{product.descriptionFa}</p>

              {/* Pricing */}
              <Card className="card-soft p-6 mb-6">
                {!product.priceHidden && product.price ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">قیمت</p>
                    <p className="text-4xl font-bold text-accent mb-4">
                      {parseFloat(product.price.toString()).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">تومان</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">قیمت</p>
                    <p className="text-lg font-semibold">
                      {isAuthenticated ? "قیمت برای شما" : "برای دیدن قیمت وارد شوید"}
                    </p>
                  </>
                )}
              </Card>

              {/* Availability & Min Order */}
              <Card className="card-soft p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">موجودی</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        product.availability === "in_stock"
                          ? "bg-green-500/20 text-green-400"
                          : product.availability === "limited"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.availability === "in_stock"
                        ? "موجود"
                        : product.availability === "limited"
                        ? "محدود"
                        : "ناموجود"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">حداقل سفارش</p>
                    <p className="font-semibold">{product.minOrderQuantity} واحد</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">کد محصول</p>
                    <p className="font-mono text-sm">{product.sku}</p>
                  </div>
                </div>
              </Card>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link href={`/contact?product=${product.id}`}>
                  <Button size="lg" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    درخواست قیمت
                  </Button>
                </Link>
                <a href="https://wa.me/qr/LDUZQ73FKIWUI1" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    واتس‌اپ
                  </Button>
                </a>
                <a href="mailto:ratibsami360@gmail.com">
                  <Button size="lg" variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    ایمیل
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Specifications & Description */}
          {(product.descriptionFa || Object.keys(specifications).length > 0) && (
            <div className="mt-12">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="description">توضیحات</TabsTrigger>
                  <TabsTrigger value="specifications">مشخصات</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <Card className="card-soft p-6">
                    <div className="prose prose-invert max-w-none">
                      {product.descriptionFa}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                  <Card className="card-soft p-6">
                    {Object.keys(specifications).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-border/50 pb-2">
                            <span className="font-semibold">{key}</span>
                            <span className="text-muted-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">مشخصاتی موجود نیست</p>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
