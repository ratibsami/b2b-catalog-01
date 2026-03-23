import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Zap, Shield, TrendingUp, Users, Package, Headphones } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold gradient-text">کاتالوگ B2B</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/catalog" className="text-sm hover:text-accent transition">
              محصولات
            </Link>
            <Link href="/about" className="text-sm hover:text-accent transition">
              درباره ما
            </Link>
            <Link href="/faq" className="text-sm hover:text-accent transition">
              سوالات متداول
            </Link>
            <Link href="/contact" className="text-sm hover:text-accent transition">
              تماس
            </Link>
            {isAuthenticated ? (
              <Link href="/admin" className="text-sm hover:text-accent transition">
                پنل ادمین
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="gradient-bg absolute inset-0 opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              پلتفرم <span className="gradient-text">کاتالوگ B2B</span> حرفه‌ای
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up">
              راه‌حل جامع برای مدیریت محصولات و ارتباط با مشتریان تجاری. دسترسی آسان، قیمت‌گذاری شفاف، و پشتیبانی 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto">
                  مشاهده محصولات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  شروع همکاری
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 md:py-24 border-t border-border/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">دسته‌بندی‌های محبوب</h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-soft h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.slice(0, 3).map((category) => (
                <Link key={category.id} href={`/catalog?category=${category.slug}`}>
                  <Card className="card-soft p-6 hover-lift cursor-pointer h-full flex flex-col justify-between">
                    {category.bannerUrl && (
                      <img
                        src={category.bannerUrl}
                        alt={category.nameFa}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold mb-2">{category.nameFa}</h3>
                      <p className="text-sm text-muted-foreground">{category.descriptionFa}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* B2B Benefits */}
      <section className="py-16 md:py-24 bg-card/30 border-t border-border/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">مزایای همکاری با ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "سرعت و کارایی",
                description: "پلتفرم سریع و بهینه‌شده برای تجربه کاربری بهتر",
              },
              {
                icon: Shield,
                title: "امنیت تضمین‌شده",
                description: "رمزنگاری سطح صنعتی و حفاظت داده‌های شما",
              },
              {
                icon: TrendingUp,
                title: "رشد تجاری",
                description: "ابزارهای تحلیلی برای بهبود فروش و دسترسی",
              },
              {
                icon: Users,
                title: "پشتیبانی تخصصی",
                description: "تیم پشتیبانی 24/7 برای کمک و راهنمایی",
              },
              {
                icon: Package,
                title: "مدیریت محصولات",
                description: "سیستم جامع برای مدیریت کاتالوگ و موجودی",
              },
              {
                icon: Headphones,
                title: "ارتباط مستقیم",
                description: "چنل‌های ارتباطی متعدد با مشتریان",
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="card-soft p-6 hover-lift">
                  <Icon className="h-12 w-12 text-accent mb-4" />
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t border-border/50">
        <div className="container">
          <div className="card-soft p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">آماده برای شروع؟</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              امروز با ما تماس بگیرید و بخشی از شبکه تجاری ما شوید
            </p>
            <Link href="/contact">
              <Button size="lg">درخواست مشاوره رایگان</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">درباره ما</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-accent transition">
                    درباره شرکت
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent transition">
                    تماس با ما
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">محصولات</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/catalog" className="hover:text-accent transition">
                    کاتالوگ
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-accent transition">
                    سوالات متداول
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">ارتباط</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://wa.me/989123456789" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">
                    واتس‌اپ
                  </a>
                </li>
                <li>
                  <a href="mailto:info@example.com" className="hover:text-accent transition">
                    ایمیل
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">حقوقی</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    شرایط استفاده
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    سیاست حریم‌خصوصی
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 کاتالوگ B2B. تمام حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
