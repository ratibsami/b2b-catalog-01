import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context for admin
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
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

describe("Logo Upload & Settings", () => {
  describe("Settings", () => {
    it("should get setting by key", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const setting = await caller.settings.get({ key: "logo_url" });
      // Setting may or may not exist
      expect(typeof setting === "object" || setting === undefined).toBe(true);
    });

    it("should update setting (admin only)", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.settings.update({
        key: "test_setting",
        value: "test_value",
      });
      // Update returns void, so just verify no error was thrown
      expect(true).toBe(true);
    });

    it("should list all settings (admin only)", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const settings = await caller.settings.all();
      expect(Array.isArray(settings)).toBe(true);
    });
  });

  describe("Category Image Upload", () => {
    it("should upload image (admin only)", async () => {
      const caller = appRouter.createCaller(createAdminContext());

      // Create a simple base64 encoded image
      const base64Image =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const result = await caller.categories.uploadImage({
        filename: "test-logo.png",
        base64: base64Image,
      });

      expect(result).toBeDefined();
      expect(result.url).toBeDefined();
      expect(result.key).toBeDefined();
      expect(typeof result.url).toBe("string");
      expect(typeof result.key).toBe("string");
    });

    it("should reject image upload for non-admin users", async () => {
      const userContext: TrpcContext = {
        user: {
          id: 2,
          openId: "regular-user",
          email: "user@example.com",
          name: "Regular User",
          loginMethod: "manus",
          role: "user",
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

      const caller = appRouter.createCaller(userContext);

      try {
        await caller.categories.uploadImage({
          filename: "test-logo.png",
          base64:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        });
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Logo Workflow", () => {
    it("should complete logo upload and storage workflow", async () => {
      const caller = appRouter.createCaller(createAdminContext());

      // Step 1: Upload image
      const base64Image =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const uploadResult = await caller.categories.uploadImage({
        filename: "new-logo.png",
        base64: base64Image,
      });

      expect(uploadResult.url).toBeDefined();

      // Step 2: Save logo URL to settings
      await caller.settings.update({
        key: "logo_url",
        value: uploadResult.url,
      });

      // Step 3: Retrieve logo URL
      const logoSetting = await caller.settings.get({ key: "logo_url" });
      expect(logoSetting?.value).toBe(uploadResult.url);
    });
  });
});
