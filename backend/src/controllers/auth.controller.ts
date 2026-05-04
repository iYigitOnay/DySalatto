import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kullanılıyor." });
      return;
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        phone: validatedData.phone,
        role: "USER" // Normal kayıt olanlar standart kullanıcı olur
      }
    });

    res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu.",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Veri Doğrulama
    const validatedData = loginSchema.parse(req.body);

    // 2. Kullanıcı Kontrolü
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre." });
      return;
    }

    // 3. Şifre Kontrolü
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre." });
      return;
    }

    // 4. Token Üretimi
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Refresh Token'ı veritabanına kaydet
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken: refreshToken,
        lastLogin: new Date()
      }
    });

    // 5. Çerez Ayarları (HttpOnly)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 gün
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
    });

    // 6. Başarılı Yanıt
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

export const me = async (req: any, res: Response): Promise<void> => {
  try {
    const user = req.user; // Set by protect middleware
    if (!user) {
      res.status(401).json({ success: false, message: "Kullanıcı bulunamadı." });
      return;
    }
    
    // We can fetch more details if needed, but req.user from protect middleware
    // already has { id, role, email, isActive }. Let's fetch full details excluding password.
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true
      }
    });

    if (!fullUser) {
      res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      return;
    }

    res.status(200).json({ success: true, data: fullUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (refreshToken) {
      // Veritabanından refresh token'ı sil
      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null }
      });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    res.status(200).json({ success: true, message: "Çıkış yapıldı." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Çıkış işlemi sırasında hata oluştu." });
  }
};
