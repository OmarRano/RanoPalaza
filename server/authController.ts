import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "./models/User";
import { COOKIE_NAME, createSessionToken, getSessionCookieOptions, getSessionToken, verifySessionToken } from "./_core/auth";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const signupBuyerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function sendError(res: Response, error: unknown, fallback = "Request failed") {
  const message = error instanceof Error ? error.message : fallback;
  return res.status(400).json({ success: false, message });
}

export async function authMe(req: Request, res: Response) {
  try {
    const token = getSessionToken(req);
    const session = await verifySessionToken(token);
    if (!session?.userId) return res.json({ success: true, user: null });

    const user = await User.findById(session.userId).lean();
    if (!user) return res.json({ success: true, user: null });

    const { passwordHash, ...safeUser } = user as any;
    return res.json({ success: true, user: safeUser });
  } catch {
    return res.json({ success: true, user: null });
  }
}

export async function authLogout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  return res.json({ success: true });
}

export async function signupBuyer(req: Request, res: Response) {
  try {
    const input = signupBuyerSchema.parse(req.body ?? {});

    if (input.password !== input.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const existing = await User.findOne({ email: input.email.toLowerCase().trim() });
    if (existing) throw new Error("Email already registered. Please sign in instead.");

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await User.create({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      passwordHash,
      phone: input.phone?.trim() || undefined,
      role: "buyer",
      isActive: true,
    });

    const token = await createSessionToken(user);
    res.cookie(COOKIE_NAME, token, getSessionCookieOptions(req));

    return res.json({ success: true, message: "Account created successfully!", role: "buyer" });
  } catch (error) {
    return sendError(res, error, "Signup failed");
  }
}

export async function loginBuyer(req: Request, res: Response) {
  try {
    const input = loginSchema.parse(req.body ?? {});

    const user = await User.findOne({ email: input.email.toLowerCase().trim() }).select("+passwordHash");
    if (!user) throw new Error("Invalid email or password.");
    if (!user.isActive) throw new Error("Your account has been deactivated. Please contact support.");
    if (!["buyer", "reader"].includes(user.role)) throw new Error("Staff accounts must use the Staff Portal login.");

    const isValid = await user.comparePassword(input.password);
    if (!isValid) throw new Error("Invalid email or password.");

    await User.findByIdAndUpdate(user._id, { lastSignedIn: new Date() });

    const token = await createSessionToken(user);
    res.cookie(COOKIE_NAME, token, getSessionCookieOptions(req));

    return res.json({ success: true, message: "Welcome back!", role: user.role });
  } catch (error) {
    return sendError(res, error, "Login failed");
  }
}

export async function loginStaff(req: Request, res: Response) {
  try {
    const input = loginSchema.parse(req.body ?? {});

    const user = await User.findOne({ email: input.email.toLowerCase().trim() }).select("+passwordHash");
    if (!user) throw new Error("Invalid email or password.");
    if (!user.isActive) throw new Error("Account deactivated. Please contact the administrator.");
    if (!["admin", "manager", "delivery", "developer", "stock_manager"].includes(user.role)) {
      throw new Error("Buyer accounts must use the Shop Account login.");
    }

    const isValid = await user.comparePassword(input.password);
    if (!isValid) throw new Error("Invalid email or password.");

    await User.findByIdAndUpdate(user._id, { lastSignedIn: new Date() });

    const token = await createSessionToken(user);
    res.cookie(COOKIE_NAME, token, getSessionCookieOptions(req));

    return res.json({ success: true, message: `Logged in as ${user.role}`, role: user.role });
  } catch (error) {
    return sendError(res, error, "Staff login failed");
  }
}
