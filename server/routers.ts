import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import crypto from "crypto";

// ========== Admin Procedure ==========
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  // ========== Auth Routes ==========
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ========== Admin Auth Routes ==========
  adminAuth: router({
    login: publicProcedure
      .input(
        z.object({
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

        if (input.password !== ADMIN_PASSWORD) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "رمز عبور نادرست است",
          });
        }

        const sessionToken = crypto.randomBytes(32).toString("hex");
        // Use consistent cookie options for admin session
        ctx.res.cookie("adminSession", sessionToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        });

        return { success: true, token: sessionToken };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      // Use same options as login to ensure cookie is properly cleared
      ctx.res.clearCookie("adminSession", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
      return { success: true };
    }),

    checkSession: publicProcedure.query(({ ctx }) => {
      const adminSession = ctx.req.cookies?.adminSession;
      return { isAuthenticated: !!adminSession };
    }),
  }),

  // ========== Categories Routes ==========
  categories: router({
    list: publicProcedure.query(async () => {
      return db.getCategories();
    }),

    all: adminProcedure.query(async () => {
      return db.getAllCategories();
    }),

    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return db.getCategoryBySlug(input.slug);
    }),

    create: adminProcedure
      .input(
        z.object({
          nameEn: z.string().min(1),
          nameFa: z.string().min(1),
          descriptionEn: z.string().optional(),
          descriptionFa: z.string().optional(),
          slug: z.string().min(1),
          bannerUrl: z.string().optional(),
          bannerKey: z.string().optional(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        return db.createCategory(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          nameEn: z.string().optional(),
          nameFa: z.string().optional(),
          descriptionEn: z.string().optional(),
          descriptionFa: z.string().optional(),
          bannerUrl: z.string().optional(),
          bannerKey: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateCategory(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteCategory(input.id);
      }),
  }),

  // ========== Products Routes ==========
  products: router({
    byCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().default(12) }))
      .query(async ({ input }) => {
        return db.getProductsByCategory(input.categoryId, input.limit);
      }),

    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return db.getProductBySlug(input.slug);
    }),

    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return db.searchProducts(input.query, input.limit);
      }),

    all: adminProcedure.query(async () => {
      return db.getAllProducts();
    }),

    byId: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getProductById(input.id);
    }),

    create: adminProcedure
      .input(
        z.object({
          categoryId: z.number(),
          nameEn: z.string().min(1),
          nameFa: z.string().min(1),
          descriptionEn: z.string().optional(),
          descriptionFa: z.string().optional(),
          slug: z.string().min(1),
          sku: z.string().min(1),
          price: z.number().optional(),
          priceHidden: z.boolean().default(false),
          minOrderQuantity: z.number().default(1),
          availability: z.enum(["in_stock", "limited", "out_of_stock"]).default("in_stock"),
          featuredImage: z.string().optional(),
          featuredImageKey: z.string().optional(),
          specifications: z.string().optional(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        return db.createProduct(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          categoryId: z.number().optional(),
          nameEn: z.string().optional(),
          nameFa: z.string().optional(),
          descriptionEn: z.string().optional(),
          descriptionFa: z.string().optional(),
          price: z.number().optional(),
          priceHidden: z.boolean().optional(),
          minOrderQuantity: z.number().optional(),
          availability: z.enum(["in_stock", "limited", "out_of_stock"]).optional(),
          featuredImage: z.string().optional(),
          featuredImageKey: z.string().optional(),
          specifications: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteProduct(input.id);
      }),
  }),

  // ========== Product Images Routes ==========
  productImages: router({
    list: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return db.getProductImages(input.productId);
      }),

    add: adminProcedure
      .input(
        z.object({
          productId: z.number(),
          imageUrl: z.string(),
          imageKey: z.string(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        return db.addProductImage(input);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteProductImage(input.id);
      }),
  }),

  // ========== Inquiries Routes ==========
  inquiries: router({
    create: publicProcedure
      .input(
        z.object({
          productId: z.number().optional(),
          senderName: z.string().min(1),
          senderEmail: z.string().email(),
          senderPhone: z.string().optional(),
          companyName: z.string().optional(),
          message: z.string().min(1),
          inquiryType: z
            .enum(["product_inquiry", "general_contact", "partnership"])
            .default("product_inquiry"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await db.createInquiry(input);

        // Send notification to admin
        try {
          await notifyOwner({
            title: "نوتیفیکیشن درخواست جدید",
            content: `درخواست جدید از ${input.senderName} (${input.senderEmail})`,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }

        return result;
      }),

    list: adminProcedure.query(async () => {
      return db.getInquiries();
    }),

    byId: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getInquiryById(input.id);
    }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "read", "replied", "archived"]).optional(),
          adminNotes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateInquiry(id, data);
      }),

    newCount: adminProcedure.query(async () => {
      return db.getNewInquiriesCount();
    }),
  }),

  // ========== Content Routes ==========
  content: router({
    byKey: publicProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
      return db.getContentByKey(input.key);
    }),

    all: adminProcedure.query(async () => {
      return db.getAllContent();
    }),

    create: adminProcedure
      .input(
        z.object({
          key: z.string().min(1),
          titleEn: z.string().optional(),
          titleFa: z.string().optional(),
          contentEn: z.string().optional(),
          contentFa: z.string().optional(),
          type: z.enum(["text", "html", "markdown"]).default("text"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return db.createContent({
          ...input,
          updatedBy: ctx.user.id,
        });
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          titleEn: z.string().optional(),
          titleFa: z.string().optional(),
          contentEn: z.string().optional(),
          contentFa: z.string().optional(),
          type: z.enum(["text", "html", "markdown"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        return db.updateContent(id, {
          ...data,
          updatedBy: ctx.user.id,
        });
      }),
  }),

  // ========== FAQs Routes ==========
  faqs: router({
    list: publicProcedure.query(async () => {
      return db.getFAQs();
    }),

    all: adminProcedure.query(async () => {
      return db.getAllFAQs();
    }),

    create: adminProcedure
      .input(
        z.object({
          questionEn: z.string().min(1),
          questionFa: z.string().min(1),
          answerEn: z.string().min(1),
          answerFa: z.string().min(1),
          category: z.string().optional(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        return db.createFAQ(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          questionEn: z.string().optional(),
          questionFa: z.string().optional(),
          answerEn: z.string().optional(),
          answerFa: z.string().optional(),
          category: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateFAQ(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteFAQ(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
