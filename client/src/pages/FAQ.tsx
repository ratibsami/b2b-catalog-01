import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data: faqs, isLoading } = trpc.faqs.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 py-12">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">سوالات متداول</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            پاسخ‌های سریع به سوالات شما
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-12">
        <div className="container max-w-3xl">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-soft h-16 animate-pulse" />
              ))}
            </div>
          ) : faqs && faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id} className="card-soft overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === faq.id ? null : faq.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/10 transition"
                  >
                    <h3 className="text-lg font-semibold text-right flex-1">
                      {faq.questionFa}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-accent transition-transform ${
                        expandedId === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-6 py-4 border-t border-border/50 bg-card/50">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answerFa}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">سوالی یافت نشد</p>
              <Link href="/contact">
                <Button>تماس با ما</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-card/30 border-t border-border/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            سوال خاصی دارید؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            تیم پشتیبانی ما آماده است تا به شما کمک کند
          </p>
          <Link href="/contact">
            <Button size="lg">تماس با تیم پشتیبانی</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
