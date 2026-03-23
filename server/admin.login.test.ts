import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type MockRes = {
  cookie: (name: string, value: string, options: any) => void;
  clearCookie: (name: string, options: any) => void;
};

function createLoginContext(): { ctx: TrpcContext; cookies: Record<string, string> } {
  const cookies: Record<string, string> = {};

  const res: MockRes = {
    cookie: (name: string, value: string) => {
      cookies[name] = value;
    },
    clearCookie: (name: string) => {
      delete cookies[name];
    },
  };

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    } as TrpcContext["req"],
    res: res as any,
  };

  return { ctx, cookies };
}

describe("adminAuth.login", () => {
  it("should reject invalid password", async () => {
    const { ctx } = createLoginContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.adminAuth.login({
        password: "wrongpass",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should accept valid password and set session cookie", async () => {
    const { ctx, cookies } = createLoginContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.adminAuth.login({
      password: process.env.ADMIN_PASSWORD || "admin123",
    });

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(cookies.adminSession).toBeDefined();
  });

  it("should verify session after login", async () => {
    const { ctx, cookies } = createLoginContext();
    const caller = appRouter.createCaller(ctx);

    // Login first
    await caller.adminAuth.login({
      password: process.env.ADMIN_PASSWORD || "admin123",
    });

    // Check session
    ctx.req.cookies = cookies;
    const sessionCheck = await caller.adminAuth.checkSession();
    expect(sessionCheck.isAuthenticated).toBe(true);
  });

  it("should logout and clear session", async () => {
    const { ctx, cookies } = createLoginContext();
    const caller = appRouter.createCaller(ctx);

    // Login
    await caller.adminAuth.login({
      password: process.env.ADMIN_PASSWORD || "admin123",
    });

    // Logout
    const logoutResult = await caller.adminAuth.logout();
    expect(logoutResult.success).toBe(true);
  });
});
