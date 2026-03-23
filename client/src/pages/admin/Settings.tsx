import { Card } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">تنظیمات سایت</h2>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">اطلاعات سایت</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">نام سایت</label>
            <p className="text-muted-foreground mt-1">Savin Global Trade</p>
          </div>
          <div>
            <label className="text-sm font-medium">توضیح</label>
            <p className="text-muted-foreground mt-1">پلتفرم کاتالوگ B2B حرفه‌ای</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
