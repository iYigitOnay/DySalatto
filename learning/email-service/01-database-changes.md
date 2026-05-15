# Adım 1: Veritabanı Hazırlığı (Prisma)

Kullanıcı modelimize doğrulama ve şifre sıfırlama için gerekli alanları ekleyelim.

### Yapılacaklar:

`backend/prisma/schema.prisma` dosyasını aç ve `User` modelini bul. `isActive` alanının hemen altına şu satırları ekle:

```prisma
model User {
  id                   String    @id @default(uuid())
  email                String    @unique
  password             String
  name                 String
  phone                String?
  role                 UserRole  @default(USER)
  refreshToken         String?
  lastLogin            DateTime?
  isActive             Boolean   @default(true)

  // -- Yeni Alanlar --
  isVerified           Boolean   @default(false)      // Mail doğrulandı mı?
  verificationCode     String?                        // 6 haneli kod
  passwordResetToken   String?                        // Şifre sıfırlama tokenı
  passwordResetExpires DateTime?                     // Token son kullanma tarihi
  // ------------------

  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  addresses            Address[]
  orders               Order[]
}
```

### Değişikliği Uygula:

Terminali aç (backend klasöründe olduğundan emin ol) ve şu komutu çalıştır:

```bash
npx prisma migrate dev --name add_auth_verification_fields
```
