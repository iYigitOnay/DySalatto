import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../lib/db";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { sendEmail } from "../services/mail.service";

const THEME_COLOR = "#e91e63"; // DySalatto/Cake için pembe/fuşya tonu

const sendVerificationEmail = async (email: string, name: string, code: string) => {
  await sendEmail(
    email,
    "DySalatto'ya Hoş Geldiniz - Doğrulama Kodunuz",
    `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: ${THEME_COLOR}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">DySalatto</h1>
      </div>
      <div style="padding: 30px; color: #333;">
        <h2 style="color: ${THEME_COLOR};">Hoş Geldin ${name}!</h2>
        <p>Lezzet dolu dünyamıza katıldığın için çok mutluyuz. Hesabını aktifleştirmek için aşağıdaki doğrulama kodunu kullanabilirsin:</p>
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: ${THEME_COLOR}; border: 2px dashed ${THEME_COLOR}; margin: 20px 0;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #666;">Eğer bu kaydı sen yapmadıysan, bu e-postayı dikkate almayabilirsin.</p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © 2026 DySalatto & DyCake. Tüm hakları saklıdır.
      </div>
    </div>
    `
  );
};

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
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        phone: validatedData.phone,
        verificationCode: verificationCode,
        role: "USER"
      }
    });

    await sendVerificationEmail(user.email, user.name, verificationCode);

    res.status(201).json({
      success: true,
      message: "Kullanıcı oluşturuldu. Lütfen e-posta adresinize gönderilen kodu doğrulayın.",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: false
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

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;

    console.log("--- DOĞRULAMA DEBUG ---");
    console.log("Gelen Email:", email);
    console.log("Gelen Kod:", code);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("Hata: Kullanıcı bulunamadı.");
      res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      return;
    }

    console.log("DB'deki Kod:", user.verificationCode);

    if (user.verificationCode !== code) {
      console.log("Hata: Kodlar eşleşmiyor!");
      res.status(400).json({ success: false, message: "Geçersiz doğrulama kodu." });
      return;
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null
      }
    });

    console.log("Başarılı: Kullanıcı doğrulandı.");
    res.status(200).json({ success: true, message: "Hesabınız başarıyla doğrulandı. Giriş yapabilirsiniz." });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ success: false, message: "Doğrulama sırasında bir hata oluştu." });
  }
};

export const resendVerificationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ success: false, message: "Bu hesap zaten doğrulanmış." });
      return;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.update({
      where: { email },
      data: { verificationCode: newCode }
    });

    await sendVerificationEmail(user.email, user.name, newCode);

    res.status(200).json({ success: true, message: "Yeni doğrulama kodu gönderildi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kod gönderilirken bir hata oluştu." });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Geçersiz e-posta veya şifre." });
      return;
    }

    // Doğrulanmamış kullanıcı kontrolü
    if (!user.isVerified) {
      res.status(403).json({ 
        success: false, 
        message: "Lütfen önce hesabınızı doğrulayın.",
        requiresVerification: true,
        email: user.email
      });
      return;
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken: refreshToken,
        lastLogin: new Date()
      }
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

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

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ success: false, message: "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı." });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 saat

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode: resetToken,
        passwordResetExpires: expires
      }
    });

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}&email=${email}`;

    await sendEmail(
      email,
      "Şifre Sıfırlama Talebi - DySalatto",
      `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: ${THEME_COLOR}; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">DySalatto</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <h2 style="color: ${THEME_COLOR};">Şifreni mi unuttun?</h2>
          <p>Hiç sorun değil! Aşağıdaki butona tıklayarak yeni şifreni belirleyebilirsin. Bu bağlantı 1 saat boyunca geçerlidir.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: ${THEME_COLOR}; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Şifremi Sıfırla</a>
          </div>
          <p style="font-size: 14px; color: #666;">Buton çalışmıyorsa bu linki tarayıcına yapıştırabilirsin:</p>
          <p style="font-size: 12px; color: #888; word-break: break-all;">${resetLink}</p>
        </div>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          © 2026 DySalatto & DyCake. Tüm hakları saklıdır.
        </div>
      </div>
      `
    );

    res.status(200).json({ success: true, message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "İşlem sırasında bir hata oluştu." });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.passwordResetCode !== token || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş sıfırlama kodu." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetExpires: null
      }
    });

    res.status(200).json({ success: true, message: "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Şifre güncellenirken bir hata oluştu." });
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

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      return;
    }

    let needsVerification = false;
    let newVerificationCode = null;

    // E-posta değişmişse kontrol et
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kullanımda." });
        return;
      }
      needsVerification = true;
      newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        name, 
        email,
        isVerified: needsVerification ? false : user.isVerified,
        verificationCode: needsVerification ? newVerificationCode : user.verificationCode
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true
      },
    });

    if (needsVerification && newVerificationCode) {
      await sendVerificationEmail(email, name || user.name, newVerificationCode);
    }

    res.status(200).json({ 
      success: true, 
      data: updatedUser,
      requiresVerification: needsVerification,
      message: needsVerification 
        ? "Profil güncellendi. Lütfen yeni e-posta adresinize gönderilen kodu doğrulayın." 
        : "Profil bilgileriniz güncellendi."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Profil güncellenemedi." });
  }
};

export const changePassword = async (req: any, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "Mevcut şifreniz hatalı." });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.status(200).json({ success: true, message: "Şifreniz başarıyla değiştirildi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Şifre değiştirme sırasında bir hata oluştu." });
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
