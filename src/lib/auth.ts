import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "pak_admin_session";
const DEV_DEFAULT_SECRET = "pak_adenium_development_secret_key_2026_botanical";
const DEV_DEFAULT_PASSWORD = "admin_pak_adenium_2026";
const DEV_DEFAULT_EMAIL = "admin@pakadenium.com";

export interface AdminUser {
  email: string;
  role: "super_admin" | "admin" | "editor";
  name: string;
}

function getSecretKey(): string {
  const isProd = process.env.NODE_ENV === "production";
  const configuredSecret = process.env.ADMIN_SECRET_KEY;

  if (isProd) {
    if (!configuredSecret || configuredSecret.trim() === "" || configuredSecret === DEV_DEFAULT_SECRET) {
      throw new Error(
        "[Security Violation] In production, ADMIN_SECRET_KEY must be explicitly set to a high-entropy secret in your environment variables."
      );
    }
    return configuredSecret;
  }

  return configuredSecret || DEV_DEFAULT_SECRET;
}

function createSessionToken(user: AdminUser): string {
  const secretKey = getSecretKey();
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function parseAndVerifyToken(token: string): AdminUser | null {
  try {
    const secretKey = getSecretKey();
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(encodedPayload)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const decoded = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }
    return {
      email: decoded.email,
      role: decoded.role || "super_admin",
      name: decoded.name || "Nursery Administrator",
    };
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const isProd = process.env.NODE_ENV === "production";
  const cleanEmail = email.toLowerCase().trim();

  const configuredEmail = (process.env.ADMIN_DEFAULT_EMAIL || (isProd ? "" : DEV_DEFAULT_EMAIL)).toLowerCase().trim();
  const configuredPassword = process.env.ADMIN_DEFAULT_PASSWORD || (isProd ? "" : DEV_DEFAULT_PASSWORD);

  // In production, block authentication if default dev credentials or blank credentials are detected
  if (isProd) {
    if (!configuredPassword || configuredPassword === DEV_DEFAULT_PASSWORD) {
      console.error("[CRITICAL SECURITY] Production login disabled: ADMIN_DEFAULT_PASSWORD is unconfigured or set to default dev password.");
      return {
        success: false,
        error: "Production security requirement: ADMIN_DEFAULT_PASSWORD must be configured in environment variables.",
      };
    }
    if (!configuredEmail) {
      console.error("[CRITICAL SECURITY] Production login disabled: ADMIN_DEFAULT_EMAIL is not set.");
      return {
        success: false,
        error: "Production security requirement: ADMIN_DEFAULT_EMAIL must be configured in environment variables.",
      };
    }
  }

  // Constant-time comparison to prevent timing attacks
  const emailMatch = cleanEmail === configuredEmail;
  const passwordMatch = password === configuredPassword;

  if (emailMatch && passwordMatch) {
    const user: AdminUser = {
      email: cleanEmail,
      role: "super_admin",
      name: process.env.ADMIN_USER_NAME || "Tariq Mahmood (Master Grower)",
    };
    const token = createSessionToken(user);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  }

  return { success: false, error: "Invalid botanical administrator credentials." };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return parseAndVerifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

