import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  longtext,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for admin/user distinction.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories for organizing the catalog
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameFa: varchar("nameFa", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionFa: text("descriptionFa"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  bannerUrl: text("bannerUrl"),
  bannerKey: varchar("bannerKey", { length: 512 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products in the B2B catalog
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameFa: varchar("nameFa", { length: 255 }).notNull(),
  descriptionEn: longtext("descriptionEn"),
  descriptionFa: longtext("descriptionFa"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: decimal("price", { precision: 12, scale: 2 }),
  priceHidden: boolean("priceHidden").default(false),
  minOrderQuantity: int("minOrderQuantity").default(1),
  availability: mysqlEnum("availability", ["in_stock", "limited", "out_of_stock"])
    .default("in_stock")
    .notNull(),
  featuredImage: text("featuredImage"),
  featuredImageKey: varchar("featuredImageKey", { length: 512 }),
  specifications: longtext("specifications"), // JSON string
  isActive: boolean("isActive").default(true),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product images gallery
 */
export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 512 }).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;

/**
 * B2B inquiries and contact form submissions
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId"),
  senderName: varchar("senderName", { length: 255 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  senderPhone: varchar("senderPhone", { length: 20 }),
  companyName: varchar("companyName", { length: 255 }),
  message: longtext("message").notNull(),
  inquiryType: mysqlEnum("inquiryType", ["product_inquiry", "general_contact", "partnership"])
    .default("product_inquiry")
    .notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"])
    .default("new")
    .notNull(),
  adminNotes: longtext("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Content management for homepage and static pages
 */
export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  titleEn: varchar("titleEn", { length: 255 }),
  titleFa: varchar("titleFa", { length: 255 }),
  contentEn: longtext("contentEn"),
  contentFa: longtext("contentFa"),
  type: mysqlEnum("type", ["text", "html", "markdown"]).default("text"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

/**
 * FAQ entries
 */
export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  questionEn: varchar("questionEn", { length: 500 }).notNull(),
  questionFa: varchar("questionFa", { length: 500 }).notNull(),
  answerEn: longtext("answerEn").notNull(),
  answerFa: longtext("answerFa").notNull(),
  category: varchar("category", { length: 100 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = typeof faqs.$inferInsert;

/**
 * Settings for logo, branding, and site configuration
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: longtext("value"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;
