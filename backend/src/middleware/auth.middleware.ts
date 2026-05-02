import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../lib/db";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Lütfen giriş yapın." });
    }

    // 1. Verify token
    const decoded = verifyAccessToken(token) as { userId: string, role: string };

    // 2. Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı veya hesabı aktif değil." });
    }

    // 3. Grant access
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Geçersiz veya süresi dolmuş anahtar." });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için yetkiniz yok.",
      });
    }
    next();
  };
};
