"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../lib/db");
const auth_schema_1 = require("../schemas/auth.schema");
const jwt_1 = require("../utils/jwt");
const register = async (req, res, next) => {
    // ... (existing register code)
    try {
        const validatedData = auth_schema_1.registerSchema.parse(req.body);
        const existingUser = await db_1.prisma.user.findUnique({ where: { email: validatedData.email } });
        if (existingUser)
            return res.status(400).json({ success: false, message: "bu e-posta adresi zaten kullanımda." });
        const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 12);
        const user = await db_1.prisma.user.create({
            data: { email: validatedData.email, password: hashedPassword, name: validatedData.name || validatedData.email.split("@")[0], phone: validatedData.phone, role: "USER" },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        });
        return res.status(201).json({ success: true, message: "Kayıt başarıyla tamamlandı.", data: user });
    }
    catch (error) {
        if (error.name === "ZodError")
            return res.status(400).json({ success: false, message: "Geçersiz veri girişi.", errors: error.errors });
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        // 1. Validation
        const validatedData = auth_schema_1.loginSchema.parse(req.body);
        // 2. Find user
        const user = await db_1.prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (!user || !(await bcrypt_1.default.compare(validatedData.password, user.password))) {
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
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        // 4. Save Refresh Token in DB & Update last login
        await db_1.prisma.user.update({
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
    }
    catch (error) {
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
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Oturum süresi dolmuş." });
        }
        // Find user with this refresh token
        const user = await db_1.prisma.user.findFirst({
            where: { refreshToken },
        });
        if (!user) {
            return res.status(401).json({ success: false, message: "Geçersiz oturum." });
        }
        // Generate new access token
        const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, role: user.role });
        return res.status(200).json({
            success: true,
            data: { accessToken },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await db_1.prisma.user.updateMany({
                where: { refreshToken },
                data: { refreshToken: null },
            });
        }
        res.clearCookie("refreshToken");
        return res.status(200).json({ success: true, message: "Çıkış yapıldı." });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map