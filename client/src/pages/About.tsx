import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Users, Zap, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 py-12">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">درباره ما</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ما متعهد به ارائه بهترین خدمات B2B هستیم
          </p>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">داستان ما</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                شرکت ما با هدف ایجاد یک پلتفرم جامع برای تجار و تولیدکنندگان تأسیس شد. ما باور داریم که
                ارتباط شفاف و کارآمد کلید موفقیت در تجارت است.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                با سال‌ها تجربه در صنعت، ما یک سیستم جامع ایجاد کردیم که به کسب‌وکارها کمک می‌کند تا
                محصولات خود را به راحتی مدیریت کنند و با مشتریان خود ارتباط برقرار کنند.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                امروز، ما افتخار می‌کنیم که به هزاران شرکت کمک کرده‌ایم تا رشد کنند و موفق شوند.
              </p>
            </div>
            <div className="card-soft p-8 text-center">
              <div className="text-5xl font-bold text-accent mb-4">۱۰+</div>
              <p className="text-lg font-semibold mb-6">سال تجربه</p>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-accent">۵۰۰۰+</div>
                  <p className="text-muted-foreground">مشتری فعال</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">۱۰۰۰۰+</div>
                  <p className="text-muted-foreground">محصول</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-card/30 border-t border-border/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">ارزش‌های ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "کیفیت",
                description: "ما بر کیفیت بالا و خدمات بی‌عیب تأکید می‌کنیم",
              },
              {
                icon: Users,
                title: "تعاون",
                description: "باور داریم که تعاون و همکاری کلید موفقیت است",
              },
              {
                icon: Zap,
                title: "نوآوری",
                description: "ما دائماً به دنبال راه‌های جدید برای بهبود هستیم",
              },
              {
                icon: Globe,
                title: "شفافیت",
                description: "ارتباط شفاف و صادقانه با مشتریان ما اولویت است",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="card-soft p-6 text-center">
                  <Icon className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">تیم ما</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            تیم متخصص ما متشکل از حرفه‌ای‌های با تجربه در زمینه‌های مختلف است که برای ارائه بهترین خدمات
            متعهد هستند.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "علی محمدی",
                role: "مدیر عمومی",
                bio: "با ۱۵ سال تجربه در صنعت تجارت الکترونیک",
              },
              {
                name: "فاطمه رضایی",
                role: "مدیر فنی",
                bio: "متخصص در توسعه سیستم‌های پیشرفته",
              },
              {
                name: "محمد حسینی",
                role: "مدیر فروش",
                bio: "متخصص در رابطه‌های مشتری و توسعه کسب‌وکار",
              },
            ].map((member, index) => (
              <Card key={index} className="card-soft p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-accent text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-card/30 border-t border-border/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">آماده برای همکاری؟</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            امروز با ما تماس بگیرید و بخشی از خانواده ما شوید
          </p>
          <Link href="/contact">
            <Button size="lg">تماس با ما</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
