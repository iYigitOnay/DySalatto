# Adım 3: Auth ve Sipariş Entegrasyonu

Şimdi bu servisi gerçek hayat senaryolarında kullanalım.

### 1. Kayıt Sonrası Doğrulama Kodu:
`backend/src/controllers/auth.controller.ts` içinde `register` fonksiyonunu bul ve kullanıcı oluşturma kısmını şu şekilde güncelle:

```typescript
// 1. Rastgele 6 haneli kod üret (Fonksiyonun en başında yapabilirsin)
const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

// 2. Kullanıcıyı oluştururken bu kodu da kaydet
const user = await prisma.user.create({
  data: {
    email: validatedData.email,
    password: hashedPassword,
    name: validatedData.name,
    phone: validatedData.phone,
    role: "USER",
    verificationCode: verificationCode // KOD BURAYA EKLENDİ
  }
});

// 3. Mail gönder (Dosyanın en üstünde sendEmail'i import etmeyi unutma!)
// import { sendEmail } from "../services/mail.service";

await sendEmail(
  user.email,
  "DySalatto'ya Hoş Geldiniz - Doğrulama Kodunuz",
  `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <h2>Hoş Geldin ${user.name}!</h2>
    <p>DySalatto ailesine katıldığın için teşekkürler. Hesabını doğrulamak için aşağıdaki kodu kullanabilirsin:</p>
    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px;">
      <strong>${verificationCode}</strong>
    </div>
  </div>
  `
);
```

### 2. Şifremi Unuttum Mantığı (Yeni Fonksiyon):
`auth.controller.ts` içine yeni bir `forgotPassword` fonksiyonu ekle:

```typescript
import crypto from 'crypto';
import { sendEmail } from "../services/mail.service";

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 saat geçerli

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: expires
    }
  });

  const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
  
  await sendEmail(
    email, 
    "Şifre Sıfırlama Talebi", 
    `<p>Şifreni sıfırlamak için <a href="${resetLink}">buraya tıkla</a>. Bu link 1 saat geçerlidir.</p>`
  );

  res.json({ success: true, message: "Sıfırlama maili gönderildi." });
};
```

### 3. Yeni Sipariş Özeti:
`order.controller.ts` içinde ödeme onaylandığı noktada benzer bir mantıkla `sendEmail` kullanarak sipariş detaylarını (ürünler, toplam tutar) müşteriye gönderebilirsin.
