import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const productId = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("product");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    companyName: "",
    message: "",
    inquiryType: "product_inquiry" as const,
  });

  const createInquiry = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success("درخواست شما با موفقیت ارسال شد");
      setFormData({
        senderName: "",
        senderEmail: "",
        senderPhone: "",
        companyName: "",
        message: "",
        inquiryType: "product_inquiry",
      });
    },
    onError: (error) => {
      toast.error("خطا در ارسال درخواست: " + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createInquiry.mutateAsync({
        ...formData,
        productId: productId ? parseInt(productId) : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 py-12">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            سوالات دارید؟ ما اینجا هستیم تا کمک کنیم. با تیم ما تماس بگیرید.
          </p>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Phone */}
                <Card className="card-soft p-6">
                  <div className="flex gap-4">
                    <Phone className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">تلفن</h3>
                      <a
                        href="tel:+8613012705854"
                        className="text-muted-foreground hover:text-accent transition"
                      >
                        +86 130 1270 5854
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Email */}
                <Card className="card-soft p-6">
                  <div className="flex gap-4">
                    <Mail className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">ایمیل</h3>
                      <a
                        href="mailto:ratibsami360@gmail.com"
                        className="text-muted-foreground hover:text-accent transition"
                      >
                        ratibsami360@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Address */}
                <Card className="card-soft p-6">
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">آدرس</h3>
                      <p className="text-muted-foreground">شنجزن - چین</p>
                    </div>
                  </div>
                </Card>

                {/* WhatsApp */}
                  <a
                    href="https://wa.me/8613012705854"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    چت در واتس‌اپ
                  </Button>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="card-soft p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">نام</label>
                    <Input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      placeholder="نام خود را وارد کنید"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">ایمیل</label>
                    <Input
                      type="email"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      placeholder="ایمیل خود را وارد کنید"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">تلفن</label>
                    <Input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleChange}
                      placeholder="شماره تلفن خود را وارد کنید"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium mb-2">نام شرکت</label>
                    <Input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="نام شرکت خود را وارد کنید"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع درخواست</label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, inquiryType: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground"
                    >
                      <option value="product_inquiry">درخواست محصول</option>
                      <option value="general_contact">تماس عمومی</option>
                      <option value="partnership">همکاری</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">پیام</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="پیام خود را وارد کنید..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "در حال ارسال..." : "ارسال درخواست"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
