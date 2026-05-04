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

---

## 6. Geliştirme Yol Haritası (Execution Roadmap)
Sistemin mock verilerden tamamen kurtulup dinamik hale gelmesi için aşağıdaki sıra izlenecektir. Her bir modül hem Backend (API) hem de Frontend (UI) olarak uçtan uca tamamlanıp bir sonrakine geçilecektir.

**Faz 1: Temel Veri Yönetimi (Altyapı)**
1. **Ana Kategoriler (Categories):** Menü başlıklarının (Kaseler, Pastalar) oluşturulması.
2. **Özellik Grupları ve Etiketler (Traits):** Filtrelerin (Diyet Tipi -> Vegan) oluşturulması.

**Faz 2: Malzeme ve DIY (Kendi Ürününü Yarat) Modülü**
1. **Malzeme Havuzu (Ingredients):** Sisteme fiyat ve stok bilgisiyle baz malzemelerin eklenmesi (Örn: Kinoa, Çilek).
2. **Oluşturma Adımları (DIY Steps):** Müşteri özel sipariş verirken göreceği "1. Taban Seç", "2. Ekstra Seç" başlıklarının yaratılması ve malzemelerin bu başlıklara bağlanması.

**Faz 3: Hazır Menü (Products) Yönetimi**
1. **Ürün CRUD İşlemleri:** Faz 1 ve Faz 2'deki verileri kullanarak (Kategori seçimi, Etiket atama, Malzeme/Reçete ekleme) gerçek menü ürünlerinin oluşturulması.

**Faz 4: Sipariş ve Finans (Orders & Finance)**
1. **Sepet ve Ödeme Akışı (Checkout):** Hazır ve DIY ürünlerin sepete eklenip "Order" ve "SubOrder" olarak bölünmesi.
2. **Sipariş Paneli:** Admin tarafına düşen siparişlerin mutfak (hazırlanıyor/teslim edildi) durumlarının yönetilmesi.
3. **Finans:** Marka bazlı gelir tablosu.
