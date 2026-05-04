import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../lib/db";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;
    
    // Authorization header kontrolü
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      // Cookie'den token kontrolü (Opsiyonel ama Next.js ile iyi çalışır)
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, message: "Lütfen giriş yapınız." });
      return;
    }

    // Token doğrulama
    const decoded = verifyAccessToken(token) as any;
    
    // Kullanıcının veritabanında olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, email: true, isActive: true }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: "Kullanıcı bulunamadı veya pasif." });
      return;
    }

    // Request objesine user ekleme
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Geçersiz veya süresi dolmuş token." });
  }
};

export const restrictToAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Bu işlem için yetkiniz yok." });
    return;
  }
  next();
};
