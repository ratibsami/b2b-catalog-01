import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // Clear existing data
  await connection.query("DELETE FROM productImages");
  await connection.query("DELETE FROM products");
  await connection.query("DELETE FROM categories");
  await connection.query("DELETE FROM faqs");
  await connection.query("DELETE FROM content");

  // Insert categories
  const categories = [
    {
      nameEn: "Electronics",
      nameFa: "الکترونیک",
      descriptionEn: "Electronic devices and components",
      descriptionFa: "دستگاه‌ها و اجزای الکترونیکی",
      slug: "electronics",
      displayOrder: 1,
    },
    {
      nameEn: "Textiles",
      nameFa: "نساجی",
      descriptionEn: "Textile products and fabrics",
      descriptionFa: "محصولات نساجی و پارچه‌ها",
      slug: "textiles",
      displayOrder: 2,
    },
    {
      nameEn: "Machinery",
      nameFa: "ماشین‌آلات",
      descriptionEn: "Industrial machinery and equipment",
      descriptionFa: "ماشین‌آلات و تجهیزات صنعتی",
      slug: "machinery",
      displayOrder: 3,
    },
  ];

  const categoryResults = [];
  for (const cat of categories) {
    const [result] = await connection.query(
      "INSERT INTO categories (nameEn, nameFa, descriptionEn, descriptionFa, slug, displayOrder) VALUES (?, ?, ?, ?, ?, ?)",
      [
        cat.nameEn,
        cat.nameFa,
        cat.descriptionEn,
        cat.descriptionFa,
        cat.slug,
        cat.displayOrder,
      ]
    );
    categoryResults.push(result.insertId);
  }

  console.log("✓ Categories inserted:", categoryResults);

  // Insert products
  const products = [
    {
      categoryId: categoryResults[0],
      nameEn: "LED Display Panel",
      nameFa: "پنل نمایش LED",
      descriptionEn: "High-quality LED display panel for commercial use",
      descriptionFa: "پنل نمایش LED با کیفیت بالا برای استفاده تجاری",
      slug: "led-display-panel",
      sku: "LED-001",
      price: 5000,
      priceHidden: false,
      minOrderQuantity: 10,
      availability: "in_stock",
      specifications: JSON.stringify({
        "Resolution": "1920x1080",
        "Brightness": "5000 nits",
        "Lifespan": "50000 hours",
      }),
      displayOrder: 1,
    },
    {
      categoryId: categoryResults[1],
      nameEn: "Premium Cotton Fabric",
      nameFa: "پارچه پنبه‌ای پریمیوم",
      descriptionEn: "100% pure cotton fabric for textile industry",
      descriptionFa: "پارچه پنبه‌ای 100% خالص برای صنعت نساجی",
      slug: "premium-cotton-fabric",
      sku: "CTN-001",
      price: 2000,
      priceHidden: false,
      minOrderQuantity: 50,
      availability: "in_stock",
      specifications: JSON.stringify({
        "Material": "100% Cotton",
        "Width": "150cm",
        "Weight": "250 gsm",
      }),
      displayOrder: 1,
    },
    {
      categoryId: categoryResults[2],
      nameEn: "Industrial Pump",
      nameFa: "پمپ صنعتی",
      descriptionEn: "Heavy-duty industrial pump for water management",
      descriptionFa: "پمپ صنعتی برای مدیریت آب",
      slug: "industrial-pump",
      sku: "PMP-001",
      price: 15000,
      priceHidden: true,
      minOrderQuantity: 5,
      availability: "limited",
      specifications: JSON.stringify({
        "Capacity": "1000 L/min",
        "Power": "15 kW",
        "Material": "Stainless Steel",
      }),
      displayOrder: 1,
    },
  ];

  const productResults = [];
  for (const prod of products) {
    const [result] = await connection.query(
      "INSERT INTO products (categoryId, nameEn, nameFa, descriptionEn, descriptionFa, slug, sku, price, priceHidden, minOrderQuantity, availability, specifications, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        prod.categoryId,
        prod.nameEn,
        prod.nameFa,
        prod.descriptionEn,
        prod.descriptionFa,
        prod.slug,
        prod.sku,
        prod.price,
        prod.priceHidden,
        prod.minOrderQuantity,
        prod.availability,
        prod.specifications,
        prod.displayOrder,
      ]
    );
    productResults.push(result.insertId);
  }

  console.log("✓ Products inserted:", productResults);

  // Insert FAQs
  const faqs = [
    {
      questionEn: "What is your minimum order quantity?",
      questionFa: "حداقل سفارش شما چقدر است؟",
      answerEn: "Minimum order quantities vary by product. Please check each product page for specific details.",
      answerFa: "حداقل سفارش برای هر محصول متفاوت است. لطفاً برای جزئیات بیشتر صفحه محصول را بررسی کنید.",
      category: "orders",
      displayOrder: 1,
    },
    {
      questionEn: "Do you offer bulk discounts?",
      questionFa: "آیا تخفیف عمده‌ای ارائه می‌دهید؟",
      answerEn: "Yes, we offer competitive bulk discounts for large orders. Contact our sales team for custom quotes.",
      answerFa: "بله، ما تخفیف‌های رقابتی برای سفارش‌های بزرگ ارائه می‌دهیم. برای پیشنهاد قیمت سفارشی با تیم فروش تماس بگیرید.",
      category: "pricing",
      displayOrder: 1,
    },
    {
      questionEn: "What payment methods do you accept?",
      questionFa: "شما چه روش‌های پرداختی را می‌پذیرید؟",
      answerEn: "We accept bank transfers, credit cards, and other secure payment methods. Contact us for details.",
      answerFa: "ما انتقال بانکی، کارت‌های اعتباری و سایر روش‌های پرداخت امن را می‌پذیریم.",
      category: "payment",
      displayOrder: 1,
    },
  ];

  for (const faq of faqs) {
    await connection.query(
      "INSERT INTO faqs (questionEn, questionFa, answerEn, answerFa, category, displayOrder) VALUES (?, ?, ?, ?, ?, ?)",
      [
        faq.questionEn,
        faq.questionFa,
        faq.answerEn,
        faq.answerFa,
        faq.category,
        faq.displayOrder,
      ]
    );
  }

  console.log("✓ FAQs inserted");

  // Insert content
  const contents = [
    {
      key: "homepage_hero_title",
      titleEn: "Hero Title",
      titleFa: "عنوان قهرمان",
      contentEn: "Professional B2B Catalog Platform",
      contentFa: "پلتفرم کاتالوگ B2B حرفه‌ای",
      type: "text",
    },
    {
      key: "homepage_hero_subtitle",
      titleEn: "Hero Subtitle",
      titleFa: "زیرعنوان قهرمان",
      contentEn: "Complete solution for managing products and connecting with business clients",
      contentFa: "راه‌حل جامع برای مدیریت محصولات و ارتباط با مشتریان تجاری",
      type: "text",
    },
  ];

  for (const content of contents) {
    await connection.query(
      "INSERT INTO content (`key`, titleEn, titleFa, contentEn, contentFa, type) VALUES (?, ?, ?, ?, ?, ?)",
      [
        content.key,
        content.titleEn,
        content.titleFa,
        content.contentEn,
        content.contentFa,
        content.type,
      ]
    );
  }

  console.log("✓ Content inserted");
  console.log("\n✓ Database seeded successfully!");
} catch (error) {
  console.error("Error seeding database:", error);
} finally {
  await connection.end();
}
