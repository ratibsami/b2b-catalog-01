import { eq, desc, and, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  products,
  productImages,
  inquiries,
  content,
  faqs,
  settings,
  Category,
  Product,
  ProductImage,
  Inquiry,
  Content,
  FAQ,
  Setting,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== Categories ==========
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.displayOrder);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(categories).orderBy(desc(categories.createdAt));
}

export async function createCategory(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(categories).values(data);
  return result;
}

export async function updateCategory(id: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.delete(categories).where(eq(categories.id, id));
}

// ========== Products ==========
export async function getProductsByCategory(categoryId: number, limit = 12) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
    .orderBy(products.displayOrder)
    .limit(limit);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function searchProducts(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        like(products.nameFa, `%${query}%`)
      )
    )
    .limit(limit);
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));
}

export async function createProduct(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.delete(products).where(eq(products.id, id));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== Product Images ==========
export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.displayOrder);
}

export async function addProductImage(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.insert(productImages).values(data);
}

export async function deleteProductImage(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.delete(productImages).where(eq(productImages.id, id));
}

// ========== Inquiries ==========
export async function createInquiry(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(inquiries).values(data);
  return result;
}

export async function getInquiries() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function getInquiryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateInquiry(id: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(inquiries).set(data).where(eq(inquiries.id, id));
}

export async function getNewInquiriesCount() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.status, "new"));

  return result.length;
}

// ========== Content ==========
export async function getContentByKey(key: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(content)
    .where(eq(content.key, key))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllContent() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(content).orderBy(desc(content.updatedAt));
}

export async function createContent(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.insert(content).values(data);
}

export async function updateContent(id: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(content).set(data).where(eq(content.id, id));
}

// ========== FAQs ==========
export async function getFAQs() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(faqs)
    .where(eq(faqs.isActive, true))
    .orderBy(faqs.displayOrder);
}

export async function getAllFAQs() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(faqs).orderBy(desc(faqs.createdAt));
}

export async function createFAQ(data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.insert(faqs).values(data);
}

export async function updateFAQ(id: number, data: any) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(faqs).set(data).where(eq(faqs.id, id));
}

export async function deleteFAQ(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return db.delete(faqs).where(eq(faqs.id, id));
}

// ========== Settings Helpers ==========
export async function getSetting(key: string): Promise<Setting | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSettings(): Promise<Setting[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(settings);
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await getSetting(key);
  if (existing) {
    await db.update(settings).set({ value }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
  }
}
