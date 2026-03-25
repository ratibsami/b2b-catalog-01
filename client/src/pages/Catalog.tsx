import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Search, ArrowRight, Image as ImageIcon, Menu, X } from "lucide-react";

export default function Catalog() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: allProducts, isLoading: productsLoading } =
    trpc.products.all.useQuery(undefined, { enabled: false });
  const { data: searchResults } = trpc.products.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const filteredProducts = useMemo(() => {
    let products = searchQuery.length > 0 ? (searchResults || []) : (allProducts || []);

    // Filter by category
    if (selectedCategory) {
      products = products.filter((p) => p.categoryId === parseInt(selectedCategory));
    }

    // Filter by price
    if (priceFilter !== "all") {
      products = products.filter((p) => {
        if (!p.price) return false;
        const price = parseFloat(p.price.toString());
        switch (priceFilter) {
          case "0-100":
            return price <= 100;
          case "100-500":
            return price > 100 && price <= 500;
          case "500+":
            return price > 500;
          default:
            return true;
        }
      });
    }

    // Filter by availability
    if (availabilityFilter !== "all") {
      products = products.filter((p) => p.availability === availabilityFilter);
    }

    return products;
  }, [allProducts, searchResults, selectedCategory, priceFilter, availabilityFilter, searchQuery]);

  // Fetch all products when component mounts
  const { refetch: refetchProducts } = trpc.products.all.useQuery(undefined, { enabled: false });
  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 py-8">
        <div className="container">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <span className="text-xs md:text-sm font-semibold gradient-text">Savin</span>
              </Link>
              <span className="text-muted-foreground hidden md:inline">/</span>
              <Link href="/" className="text-muted-foreground hover:text-accent transition hidden md:inline">
                ابتدا
              </Link>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:inline" />
              <span className="text-foreground hidden md:inline">کاتالوگ محصولات</span>
            </div>
            <button
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold">کاتالوگ محصولات</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            تمام محصولات و خدمات ما را کاوش کنید
          </p>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/50 bg-background/95">
          <div className="container py-4 space-y-3">
            <Link
              href="/catalog"
              className="block text-sm hover:text-accent transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              کاتالوگ
            </Link>
            <Link
              href="/about"
              className="block text-sm hover:text-accent transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              درباره ما
            </Link>
            <Link
              href="/faq"
              className="block text-sm hover:text-accent transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              سوالات متداول
            </Link>
            <Link
              href="/contact"
              className="block text-sm hover:text-accent transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              تماس
            </Link>
          </div>
        </div>
      )}

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <div className="py-12 border-b border-border/50 bg-card/10">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">دسته‌بندی‌های محصولات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/catalog?category=${category.id}`}>
                  <Card className="card-soft overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col group">
                    {/* Category Image */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-accent/10 to-accent/5 overflow-hidden">
                      {category.bannerUrl ? (
                        <img
                          src={category.bannerUrl}
                          alt={category.nameFa}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{category.nameFa}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {category.descriptionFa || category.descriptionEn}
                      </p>
                      <Button variant="outline" className="w-full mt-4">
                        مشاهده محصولات
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="border-b border-border/50 bg-card/20 py-6 sticky top-0 z-40">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو برای محصولات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? null : v)}>
              <SelectTrigger>
                <SelectValue placeholder="دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">تمام دسته‌ها</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.nameFa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="قیمت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">تمام قیمت‌ها</SelectItem>
                <SelectItem value="0-100">0 - 100</SelectItem>
                <SelectItem value="100-500">100 - 500</SelectItem>
                <SelectItem value="500+">500+</SelectItem>
              </SelectContent>
            </Select>

            {/* Availability Filter */}
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="موجودی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">تمام موجودی‌ها</SelectItem>
                <SelectItem value="in_stock">موجود</SelectItem>
                <SelectItem value="limited">محدود</SelectItem>
                <SelectItem value="out_of_stock">ناموجود</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-12">
        <div className="container">
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-soft h-64 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filteredProducts.length} محصول یافت شد
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`}>
                    <Card className="card-soft overflow-hidden hover-lift cursor-pointer h-full flex flex-col">
                      {product.featuredImage && (
                        <img
                          src={product.featuredImage}
                          alt={product.nameFa}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold mb-2 line-clamp-2">{product.nameFa}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.descriptionFa}
                        </p>
                        <div className="mt-auto space-y-2">
                          {!product.priceHidden && product.price && (
                            <p className="text-lg font-bold text-accent">
                              {parseFloat(product.price.toString()).toLocaleString()} افغانی
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`px-2 py-1 rounded-full ${
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
                            <span className="text-muted-foreground">
                              حداقل سفارش: {product.minOrderQuantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">محصولی یافت نشد</h3>
              <p className="text-muted-foreground">
                لطفاً فیلترهای خود را تغییر دهید یا بعداً دوباره امتحان کنید
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
