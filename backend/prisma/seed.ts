import { PrismaClient, Brand, UserRole, ProductStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Başlatılıyor...');

  // 1. ADMIN USER
  const adminEmail = 'ihsanyigitonay@gmail.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'İhsan Yiğit Onay',
        role: UserRole.ADMIN,
        isActive: true,
      }
    });
    console.log('[SEED] Admin kullanıcısı oluşturuldu.');
  }

  // 2. CATEGORIES
  const salattoCategories = [
    { name: 'Bowl', slug: 'bowl', brand: Brand.DYSALATTO },
    { name: 'Wrap', slug: 'wrap', brand: Brand.DYSALATTO },
    { name: 'Salata', slug: 'salata', brand: Brand.DYSALATTO },
    { name: 'İçecek', slug: 'icecek', brand: Brand.DYSALATTO },
  ];

  const cakeCategories = [
    { name: 'Pasta', slug: 'pasta', brand: Brand.DYCAKE },
    { name: 'Kurabiye', slug: 'kurabiye', brand: Brand.DYCAKE },
    { name: 'Tatlı', slug: 'tatli', brand: Brand.DYCAKE },
  ];

  for (const cat of [...salattoCategories, ...cakeCategories]) {
    await prisma.category.upsert({
      where: { brand_slug: { brand: cat.brand, slug: cat.slug } },
      update: {},
      create: cat,
    });
  }
  console.log('[SEED] Kategoriler oluşturuldu.');

  // 3. TRAIT GROUPS & TRAITS
  const dietaryGroupSalatto = await prisma.traitGroup.create({
    data: { brand: Brand.DYSALATTO, name: 'Beslenme Tercihi' }
  });

  const dietaryGroupCake = await prisma.traitGroup.create({
    data: { brand: Brand.DYCAKE, name: 'Beslenme Tercihi' }
  });

  const salattoTraits = ['Vegan', 'Vejetaryen', 'Glutensiz', 'Yüksek Protein', 'Düşük Karbonhidrat'];
  const cakeTraits = ['Rafine Şekersiz', 'Glutensiz', 'Vegan', 'Düşük Kalori'];

  for (const name of salattoTraits) {
    await prisma.trait.create({ data: { name, traitGroupId: dietaryGroupSalatto.id } });
  }
  for (const name of cakeTraits) {
    await prisma.trait.create({ data: { name, traitGroupId: dietaryGroupCake.id } });
  }
  console.log('[SEED] Filtreler (Traits) oluşturuldu.');

  // 4. INGREDIENTS
  const ingredients = [
    { name: 'Mısır', brand: Brand.DYSALATTO, price: 15 },
    { name: 'Avokado', brand: Brand.DYSALATTO, price: 45 },
    { name: 'Tavuk', brand: Brand.DYSALATTO, price: 65 },
    { name: 'Somon', brand: Brand.DYSALATTO, price: 95 },
    { name: 'Hurma Özü', brand: Brand.DYCAKE, price: 20 },
    { name: 'Belçika Çikolatası', brand: Brand.DYCAKE, price: 40 },
    { name: 'Badem Unu', brand: Brand.DYCAKE, price: 35 },
  ];

  const createdIngredients: any = {};
  for (const ing of ingredients) {
    const created = await prisma.ingredient.create({ data: ing });
    createdIngredients[ing.name] = created.id;
  }
  console.log('[SEED] Malzemeler (Ingredients) oluşturuldu.');

  // 5. PRODUCTS
  const bowlCat = await prisma.category.findFirst({ where: { slug: 'bowl', brand: Brand.DYSALATTO } });
  const pastaCat = await prisma.category.findFirst({ where: { slug: 'pasta', brand: Brand.DYCAKE } });

  if (bowlCat && pastaCat) {
    // Salatto Product
    await prisma.product.create({
      data: {
        brand: Brand.DYSALATTO,
        name: 'Protein Kasesi',
        description: 'Izgara tavuk, kinoa, mısır ve taze yeşillikler.',
        price: 245,
        categoryId: bowlCat.id,
        ingredients: {
          create: [
            { ingredientId: createdIngredients['Tavuk'] },
            { ingredientId: createdIngredients['Mısır'] },
          ]
        }
      }
    });

    // Cake Product
    await prisma.product.create({
      data: {
        brand: Brand.DYCAKE,
        name: 'Fit San Sebastian',
        description: 'Rafine şekersiz, hurma özüyle tatlandırılmış efsane lezzet.',
        price: 185,
        categoryId: pastaCat.id,
        ingredients: {
          create: [
            { ingredientId: createdIngredients['Hurma Özü'] },
          ]
        }
      }
    });
  }

  console.log('[SEED] Ürünler oluşturuldu.');
  console.log('[SEED] Tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
