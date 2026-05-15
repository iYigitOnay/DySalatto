# Adım 2: Resend Kurulumu ve Mail Servisi

Şimdi mail gönderecek "motoru" kuralım.

### Yapılacaklar:

1. **API Key:** `.env` dosyasına Resend'den aldığın anahtarı ekle:

```env
RESEND_API_KEY=re_123456789
```

2. **Dosya Oluştur:** `backend/src/services/mail.service.ts` dosyasını oluştur ve içine şu kodu yaz:

```typescript
import { Resend } from "resend";

// .env dosyasındaki anahtarı kullanıyoruz
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const data = await resend.emails.send({
      from: "DySalatto <onboarding@resend.dev>", 
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Mail Gönderme Hatası:", error);
    return { success: false, error };
  }
};
```

### Önemli Not:

Resend'de ücretsiz planda sadece kendi doğruladığın e-posta adresine mail gönderebilirsin. Test yaparken kendi mail adresini kullanmayı unutma.
