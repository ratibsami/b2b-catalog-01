import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const logoQuery = trpc.settings.get.useQuery({ key: "logo_url" });
  const uploadImageMutation = trpc.categories.uploadImage.useMutation();
  const updateSettingMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("لوگو با موفقیت آپلود شد");
      setLogoFile(null);
      setLogoPreview("");
      logoQuery.refetch();
    },
    onError: () => {
      toast.error("خطا در ذخیره لوگو");
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error("لطفاً یک تصویر انتخاب کنید");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        try {
          const result = await uploadImageMutation.mutateAsync({
            filename: logoFile.name,
            base64,
          });

          await updateSettingMutation.mutateAsync({
            key: "logo_url",
            value: result.url,
          });
        } catch (error) {
          toast.error("خطا در آپلود لوگو");
          console.error(error);
        }
      };
      reader.readAsDataURL(logoFile);
    } catch (error) {
      toast.error("خطا در پردازش فایل");
      console.error(error);
    }
  };

  const isLoading = uploadImageMutation.isPending || updateSettingMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">تنظیمات سایت</h2>
      </div>

      {/* Logo Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">لوگو</h3>
        <div className="space-y-4">
          {logoQuery.data?.value && (
            <div className="flex justify-center mb-4">
              <img
                src={logoQuery.data.value}
                alt="Current Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          )}

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
            <Input
              type="file"
              accept="image/*,.svg"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-input"
              disabled={isLoading}
            />
            <label htmlFor="logo-input" className="cursor-pointer block">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground mb-2">
                برای انتخاب لوگو کلیک کنید
              </div>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Preview"
                  className="h-20 w-20 mx-auto mb-2 object-contain"
                />
              )}
              {logoFile && (
                <div className="text-xs text-muted-foreground mt-2">
                  {logoFile.name}
                </div>
              )}
            </label>
          </div>

          <Button
            onClick={handleLogoUpload}
            disabled={!logoFile || isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "در حال آپلود..." : "آپلود لوگو"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
