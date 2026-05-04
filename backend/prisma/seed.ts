import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'ihsanyigitonay@gmail.com';
  
  // Admin hesabının var olup olmadığını kontrol et
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log(`[SEED] Admin kullanıcısı (${adminEmail}) zaten mevcut.`);
    return;
  }

  // Güvenli şifre oluştur (Varsayılan şifre: admin123)
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin kullanıcısını veritabanına ekle
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'İhsan Yiğit Onay',
      role: 'ADMIN',
      isActive: true,
    }
  });

  console.log(`[SEED] Başarılı! Admin oluşturuldu.`);
  console.log(`Email: ${admin.email}`);
  console.log(`Şifre: admin123`);
  console.log(`(Lütfen giriş yaptıktan sonra şifrenizi değiştirin)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
