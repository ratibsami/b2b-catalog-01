import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
function createMockContext(role: "admin" | "user" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("B2B Catalog API", () => {
  describe("Categories", () => {
    it("should list public categories", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const categories = await caller.categories.list();
      expect(Array.isArray(categories)).toBe(true);
    });

    it("should get category by slug", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const category = await caller.categories.bySlug({ slug: "electronics" });
      // Category may or may not exist in test database
      expect(typeof category === "object" || category === undefined).toBe(true);
    });

    it("should require admin role to list all categories", async () => {
      const caller = appRouter.createCaller(createMockContext("user"));
      try {
        await caller.categories.all();
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin to list all categories", async () => {
      const caller = appRouter.createCaller(createMockContext("admin"));
      const categories = await caller.categories.all();
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe("Products", () => {
    it("should search products", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const results = await caller.products.search({ query: "LED" });
      expect(Array.isArray(results)).toBe(true);
    });

    it("should get product by slug", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const product = await caller.products.bySlug({ slug: "led-display-panel" });
      // Product may or may not exist in test database
      expect(typeof product === "object" || product === undefined).toBe(true);
      if (product) {
        expect(product.nameFa).toBeDefined();
      }
    });

    it("should get products by category", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const products = await caller.products.byCategory({ categoryId: 1 });
      expect(Array.isArray(products)).toBe(true);
    });

    it("should require admin role to list all products", async () => {
      const caller = appRouter.createCaller(createMockContext("user"));
      try {
        await caller.products.all();
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Inquiries", () => {
    it("should create inquiry without authentication", async () => {
      const caller = appRouter.createCaller(createMockContext("user"));
      const result = await caller.inquiries.create({
        senderName: "John Doe",
        senderEmail: "john@example.com",
        senderPhone: "+989123456789",
        companyName: "Test Company",
        message: "I am interested in your products",
        inquiryType: "product_inquiry",
      });
      expect(result).toBeDefined();
    });

    it("should require admin role to list inquiries", async () => {
      const caller = appRouter.createCaller(createMockContext("user"));
      try {
        await caller.inquiries.list();
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin to list inquiries", async () => {
      const caller = appRouter.createCaller(createMockContext("admin"));
      const inquiries = await caller.inquiries.list();
      expect(Array.isArray(inquiries)).toBe(true);
    });
  });

  describe("FAQs", () => {
    it("should list public FAQs", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const faqs = await caller.faqs.list();
      expect(Array.isArray(faqs)).toBe(true);
    });

    it("should require admin role to create FAQ", async () => {
      const caller = appRouter.createCaller(createMockContext("user"));
      try {
        await caller.faqs.create({
          questionEn: "Test?",
          questionFa: "تست؟",
          answerEn: "Test answer",
          answerFa: "پاسخ تست",
        });
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Content", () => {
    it("should get content by key", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const content = await caller.content.byKey({
        key: "homepage_hero_title",
      });
      expect(content).toBeDefined();
    });

    it("should require admin role to create content", async () => {
      const caller = appRouter.createCaller(createMockContext("user"));
      try {
        await caller.content.create({
          key: "test_key",
          contentEn: "Test",
          contentFa: "تست",
        });
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Auth", () => {
    it("should return current user", async () => {
      const caller = appRouter.createCaller(createMockContext());
      const user = await caller.auth.me();
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
    });

    it("should logout successfully", async () => {
      const clearedCookies: any[] = [];
      const ctx: TrpcContext = {
        user: createMockContext().user,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {
          clearCookie: (name: string, options: any) => {
            clearedCookies.push({ name, options });
          },
        } as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });
  });
});
