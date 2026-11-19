import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

interface RateLimitRecord {
  attempts: number;
  lockUntil: number;
  firstAttempt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout
const WINDOW_MS = 15 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = loginAttempts.get(ip);

  // Check if IP is currently locked out
  if (record && record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: `Too many failed login attempts. Account locked for security. Please try again in ${Math.ceil(
          remainingSeconds / 60
        )} minutes.`,
      },
      {
        status: 429,
        headers: { "Retry-After": remainingSeconds.toString() },
      }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const res = await loginAdmin(email, password);

    if (!res.success) {
      // Record failed attempt
      const current = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0, firstAttempt: now };

      // Reset if window expired
      if (now - current.firstAttempt > WINDOW_MS) {
        current.attempts = 1;
        current.firstAttempt = now;
      } else {
        current.attempts += 1;
      }

      if (current.attempts >= MAX_ATTEMPTS) {
        current.lockUntil = now + LOCKOUT_MS;
        loginAttempts.set(ip, current);
        return NextResponse.json(
          {
            success: false,
            error: "Too many failed attempts. Login locked for 15 minutes.",
          },
          { status: 429, headers: { "Retry-After": "900" } }
        );
      }

      loginAttempts.set(ip, current);
      const remaining = MAX_ATTEMPTS - current.attempts;

      return NextResponse.json(
        {
          success: false,
          error: `${res.error || "Invalid credentials."} (${remaining} attempt${
            remaining === 1 ? "" : "s"
          } remaining before lockout)`,
        },
        { status: 401 }
      );
    }

    // Success: clear rate limit history for IP
    loginAttempts.delete(ip);
    return NextResponse.json({ success: true, message: "Welcome to Pak Adenium Admin" });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
