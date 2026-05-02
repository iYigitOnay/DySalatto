"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const express_1 = require("express");
const jwt_1 = require("../utils/jwt");
const db_1 = require("../lib/db");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ success: false, message: "Lütfen giriş yapın." });
        }
        // 1. Verify token
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        // 2. Check if user still exists
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı veya hesabı aktif değil." });
        }
        // 3. Grant access
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Geçersiz veya süresi dolmuş anahtar." });
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Bu işlem için yetkiniz yok.",
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.middleware.js.map