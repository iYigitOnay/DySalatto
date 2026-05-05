import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db";

const ACCESS_SECRET = process.env.JWT_SECRET || "fallback_access_secret";

export const protect = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    // 1. Token'ı çerezden veya header'dan al
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: "Lütfen giriş yapınız." });
      return;
    }

    // 2. Token'ı doğrula
    const decoded: any = jwt.verify(token, ACCESS_SECRET);

    // 3. Kullanıcıyı veritabanından bul
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: "Kullanıcı artık aktif değil veya bulunamadı." });
      return;
    }

    // 4. Kullanıcı bilgisini request nesnesine ekle
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Oturum geçersiz veya süresi dolmuş." });
  }
};

export const restrictToAdmin = (req: any, res: Response, next: NextFunction): void => {
  if (req.user.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Bu işlemi yapmak için yetkiniz yok." });
    return;
  }
  next();
};
