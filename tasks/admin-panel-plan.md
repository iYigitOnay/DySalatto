# Admin Panel Mimari ve Geliştirme Planı v3

## 1. Temel Konsept & Karşılama Ekranı (Gateway)

- **Gateway (Geçit):** Giriş yapıldığında admini "DYSalatto" ve "DYCake" seçim ekranı karşılar.
- **Tasarım Dili (Estetik):** Cyberpunk veya aşırı teknolojik ("AI izi taşıyan") tasarımlar kesinlikle kullanılmayacaktır. Arayüz; markanın ruhuna uygun, "butik", zarif, sıcak tonların kullanıldığı (örneğin mevcut sitenin pastel, davetkar havası), temiz (clean) ve kullanıcı dostu bir "Artisan" görünümünde tasarlanacaktır.

## 2. Karışık Sipariş (Cross-Brand Order) Yönetimi

Müşteri tek bir sepet üzerinden hem Salatto'dan bir bowl hem de Cake'den bir tatlı sipariş edebilir.

- **Müşteri Gözünde:** Tek bir sepet, tek bir ödeme işlemi (Checkout) gerçekleşir.
- **Admin Panelinde (Arka Planda):** Sistem bu tek siparişi alır ve alt siparişlere (Sub-Orders) böler.
  - DYSalatto paneline sadece Salatto siparişi "Yeni Sipariş" düşer.
  - DYCake paneline sadece Cake siparişi "Yeni Sipariş" düşer.
  - Kurye/Teslimat Fişi: Her mutfak kendi ürününü hazırlar, kurye fişinde "Paket 1: Salatto'dan, Paket 2: Cake'den" olarak çıkar. Finans hesaplamaları markalara göre ayrılır.

## 3. Dinamik Kategori ve Filtre Mimarisi

Mutfak sayfalarındaki tüm kategoriler ve filtreler admin panelden (CRUD) yönetilir. Sabit (`mockData`) veri kullanılmaz.

- **Ana Kategori:** Örn. "Pastalar", "Kaseler"
- **Özellik Grupları:** Örn. "Beslenme Tercihi", "İçerik Hassasiyeti"
- **Özellikler (Etiketler):** Örn. "Rafine Şekersiz", "Vegan", "Glutensiz"

## 4. "Kendi Tasarımını Yarat" (DIY) ve Malzeme Mimarisi (YENİ)

Sistem sadece hazır ürünlerin satışını değil, "Kendi Kaseni / Pastanı Oluştur" (DIY) modelini destekleyecek şekilde tasarlanır.

**A. Dinamik Oluşturma Adımları (Ingredient Steps):**
Müşterinin seçim yaparken göreceği başlıklar sabit koda yazılmaz. Admin bu adımları sırasıyla panelden oluşturur.

- _Örnek (Salatto):_ Admin sırasıyla şu adımları açar: "1. Taban Seç", "2. Kas İster Misin? (Protein)", "3. Ekstralar", "4. Son Dokunuş (Sos)".
- _Örnek (Cake):_ Admin şu adımları açar: "1. Kek Tabanı", "2. İç Dolgu", "3. Meyveler", "4. Süsleme".

**B. Malzeme Havuzu (Ingredients):**
Her malzeme veritabanında fiyatı ve stok durumuyla tutulur. Malzemeler, oluşturulan "Adımlar" ile eşleştirilir.

- Örn: "Izgara Tavuk" eklenir ve "Kas İster Misin?" adımına bağlanır.
- Örn: "Belçika Çikolatalı Ganaj" eklenir ve "İç Dolgu" adımına bağlanır.

**C. Özel Sipariş Akışı (Müşteri & Mutfak):**

- Müşteri sitede adım adım (adminin belirlediği başlıklar altında) ürününü oluşturur.
- Fiyat, seçilen malzemelere göre dinamik olarak hesaplanır.
- Mutfak ekranına ve admine düz bir ürün değil, reçetesi açıkça yazılmış bir "ÖZEL KASE / ÖZEL PASTA" siparişi düşer.

## 5. Ürün (Hazır Menü) Ekleme Mantığı

Standart bir menü ürünü (Örn: "Tavuklu Kinoa Bowl" veya "Orman Meyveli Raw Tart") eklenirken:

1. **Temel Bilgiler:** Marka, Ad, Açıklama, Fiyat, Görsel.
2. **Kategori Seçimi:** Sisteme eklenmiş Ana Kategorilerden biri seçilir.
3. **Etiket/Filtre Eşleştirme:** "Vegan", "Glutensiz" vb. etiketler seçilir.
4. **İçindekiler (Reçete) Eşleştirme:** Admin, "Malzeme Havuzu"nda var olan malzemeleri (Örn: Kinoa, Izgara Tavuk, Siyah Susam) ürüne bağlar. Sistemde o an olmayan bir malzeme aratıldığında, sayfadan ayrılmadan "Yeni Ekle" butonuna basılarak o malzeme anında veritabanına eklenir. (Bu sayede müşteri ekranında şeffaf bir içerik listesi gösterilir).
