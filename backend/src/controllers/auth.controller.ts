import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  // ... (existing register code)
  try {
    const validatedData = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (existingUser) return res.status(400).json({ success: false, message: "bu e-posta adresi zaten kullanımda." });
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    const user = await prisma.user.create({
      data: { email: validatedData.email, password: hashedPassword, name: validatedData.name || validatedData.email.split("@")[0], phone: validatedData.phone, role: "USER" },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    return res.status(201).json({ success: true, message: "Kayıt başarıyla tamamlandı.", data: user });
  } catch (error: any) {
    if (error.name === "ZodError") return res.status(400).json({ success: false, message: "Geçersiz veri girişi.", errors: error.errors });
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validation
    const validatedData = loginSchema.parse(req.body);

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "E-posta veya şifre hatalı.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Hesabınız askıya alınmıştır.",
      });
    }

    // 3. Generate Tokens
    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 4. Save Refresh Token in DB & Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken: refreshToken, // For security, you could hash this
        lastLogin: new Date()
      },
    });

    // 5. Send Refresh Token in HttpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Response
    return res.status(200).json({
      success: true,
      message: "Giriş başarılı.",
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Geçersiz veri girişi.",
        errors: error.errors,
      });
    }
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Oturum süresi dolmuş." });
    }

    // Find user with this refresh token
    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Geçersiz oturum." });
    }

    // Generate new access token
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });

    return res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null },
      });
    }

    res.clearCookie("refreshToken");
    return res.status(200).json({ success: true, message: "Çıkış yapıldı." });
  } catch (error) {
    next(error);
  }
};
