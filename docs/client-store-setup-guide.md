# Client Shopify Store Setup Guide
# Müşteri Shopify Mağaza Kurulum Kılavuzu

---

## Table of Contents / İçindekiler

1. [Prerequisites / Ön Gereksinimler](#1-prerequisites--ön-gereksinimler)
2. [Shopify Partner Account / Partner Hesabı](#2-shopify-partner-account--partner-hesabı)
3. [Create the Shopify Store / Mağaza Oluşturma](#3-create-the-shopify-store--mağaza-oluşturma)
4. [Storefront API Configuration / Storefront API Yapılandırması](#4-storefront-api-configuration--storefront-api-yapılandırması)
5. [Store Content Setup / Mağaza İçeriği Kurulumu](#5-store-content-setup--mağaza-içeriği-kurulumu)
6. [Payment Gateway Setup / Ödeme Altyapısı Kurulumu](#6-payment-gateway-setup--ödeme-altyapısı-kurulumu)
7. [Codebase Configuration / Kod Yapılandırması](#7-codebase-configuration--kod-yapılandırması)
8. [Deployment to Vercel / Vercel'e Deploy](#8-deployment-to-vercel--vercel-e-deploy)
9. [Domain Setup / Domain Kurulumu](#9-domain-setup--domain-kurulumu)
10. [Localization / Lokalizasyon](#10-localization--lokalizasyon)
11. [Testing Checklist / Test Kontrol Listesi](#11-testing-checklist--test-kontrol-listesi)
12. [Go-Live Checklist / Yayına Alma Kontrol Listesi](#12-go-live-checklist--yayına-alma-kontrol-listesi)
13. [Post-Launch / Yayın Sonrası](#13-post-launch--yayın-sonrası)
14. [Environment Variables Reference / Ortam Değişkenleri Referansı](#14-environment-variables-reference--ortam-değişkenleri-referansı)

---

## 1. Prerequisites / Ön Gereksinimler

### English
Before starting, confirm the following with the client:

- [ ] Client's brand name, logo, and color palette
- [ ] Product catalog (titles, descriptions, prices, images, variants)
- [ ] Supported languages (Turkish, English, Arabic, German…)
- [ ] Target currency or currencies
- [ ] Shipping regions and rates
- [ ] Return & refund policy text
- [ ] Contact email and phone number
- [ ] Domain name (e.g. `shop.clientdomain.com`) — or confirm they will purchase one
- [ ] Preferred payment method (Shopify Payments, iyzico, PayTR, Stripe, etc.)

### Türkçe
Başlamadan önce müşteri ile şunları netleştirin:

- [ ] Marka adı, logo ve renk paleti
- [ ] Ürün kataloğu (başlık, açıklama, fiyat, görseller, varyantlar)
- [ ] Desteklenecek diller (Türkçe, İngilizce, Arapça, Almanca…)
- [ ] Hedef para birimi veya birimleri
- [ ] Kargo bölgeleri ve ücretleri
- [ ] İade ve iade politikası metni
- [ ] İletişim e-postası ve telefon numarası
- [ ] Domain adı (örn. `shop.clientdomain.com`) — ya da satın alacaklarını onaylayın
- [ ] Tercih edilen ödeme yöntemi (Shopify Payments, iyzico, PayTR, Stripe vb.)

---

## 2. Shopify Partner Account / Partner Hesabı

### English
A Shopify Partner account lets you create free development stores for clients and transfer them upon project completion.

1. Go to [partners.shopify.com](https://partners.shopify.com) and sign up (free).
2. Verify your email and complete your partner profile.
3. You will manage all client stores from one Partner Dashboard.

> **Important:** Never create the store directly under the client's personal account during development. Always use the Partner dashboard — this allows you to work for free and transfer ownership when the client is ready to pay.

### Türkçe
Shopify Partner hesabı, müşteriler için ücretsiz geliştirme mağazaları oluşturmanıza ve projeyi tamamladıktan sonra mağazayı devretmenize imkân tanır.

1. [partners.shopify.com](https://partners.shopify.com) adresine gidin ve kayıt olun (ücretsiz).
2. E-postanızı doğrulayın ve partner profilinizi tamamlayın.
3. Tüm müşteri mağazalarını tek bir Partner Dashboard üzerinden yöneteceksiniz.

> **Önemli:** Geliştirme sürecinde mağazayı müşterinin kişisel hesabında oluşturmayın. Her zaman Partner dashboard'u kullanın — bu sayede ücretsiz çalışabilir ve müşteri ödemeye hazır olduğunda sahipliği devredebilirsiniz.

---

## 3. Create the Shopify Store / Mağaza Oluşturma

### English

#### 3.1 Create a Development Store
1. In Partner Dashboard → **Stores** → **Add store** → **Create development store**.
2. Fill in:
   - **Store name:** e.g. `clientname-store`
   - **Store URL:** will become `clientname-store.myshopify.com`
   - **Store purpose:** Select "Build a custom storefront" (headless)
   - **Store type:** Development store
3. Click **Save**.

#### 3.2 Basic Store Settings
After the store is created, go to **Shopify Admin**:

| Setting | Path | What to configure |
|---------|------|-------------------|
| Store name & email | Settings → General | Brand name, contact email |
| Currency | Settings → General | Client's primary currency |
| Timezone | Settings → General | Client's timezone |
| Store address | Settings → General | Required for tax calculations |
| Checkout language | Settings → Languages | Add all required languages |
| Legal pages | Settings → Policies | Privacy policy, terms, returns, shipping |

### Türkçe

#### 3.1 Geliştirme Mağazası Oluşturma
1. Partner Dashboard → **Stores** → **Add store** → **Create development store**.
2. Doldurun:
   - **Store name:** örn. `clientname-store`
   - **Store URL:** `clientname-store.myshopify.com` olacak
   - **Store purpose:** "Build a custom storefront" (headless) seçin
   - **Store type:** Development store
3. **Save**'e tıklayın.

#### 3.2 Temel Mağaza Ayarları
Mağaza oluşturulduktan sonra **Shopify Admin**'e gidin:

| Ayar | Yol | Ne yapılacak |
|------|-----|--------------|
| Mağaza adı ve e-posta | Settings → General | Marka adı, iletişim e-postası |
| Para birimi | Settings → General | Müşterinin ana para birimi |
| Saat dilimi | Settings → General | Müşterinin saat dilimi |
| Mağaza adresi | Settings → General | Vergi hesaplamaları için zorunlu |
| Checkout dili | Settings → Languages | Tüm gerekli dilleri ekleyin |
| Yasal sayfalar | Settings → Policies | Gizlilik, kullanım koşulları, iade, kargo |

---

## 4. Storefront API Configuration / Storefront API Yapılandırması

### English
The headless storefront communicates with Shopify exclusively via the Storefront GraphQL API. You need to create a **Headless channel** or a **Custom app** to get the access token.

#### 4.1 Create a Headless Sales Channel (Recommended)
1. Shopify Admin → **Apps** → **Add apps** → Search for **"Headless"** → Install.
2. Once installed, go to **Headless** app → **Storefront API** tab.
3. Click **Generate token**.
4. Under **Storefront API permissions**, enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customer_tags`
   - `unauthenticated_read_content`
5. Save. Copy the **Storefront Access Token** — you will need it in Step 7.

#### 4.2 Alternative: Custom App
1. Shopify Admin → **Settings** → **Apps and sales channels** → **Develop apps**.
2. Click **Allow custom app development** (one-time confirmation).
3. **Create an app** → Enter app name (e.g. "Headless Storefront").
4. Go to **Configuration** → **Storefront API integration** → Check the same permissions listed above.
5. **Install app** → Copy the **Storefront API access token**.

#### 4.3 Note the credentials
```
SHOPIFY_STORE_DOMAIN = clientname-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN = shpat_xxxxxxxxxxxxxxxxxxxx
```

> **Security:** The Storefront Access Token is a public-facing read token. Keep it in `.env.local` and Vercel environment variables. Never expose the Admin API token.

### Türkçe
Headless storefront, Shopify ile yalnızca Storefront GraphQL API üzerinden iletişim kurar. Access token almak için **Headless channel** veya **Custom app** oluşturmanız gerekir.

#### 4.1 Headless Sales Channel Oluşturma (Önerilir)
1. Shopify Admin → **Apps** → **Add apps** → **"Headless"** ara → Yükle.
2. Kurulduktan sonra **Headless** uygulaması → **Storefront API** sekmesi.
3. **Generate token** butonuna tıklayın.
4. **Storefront API permissions** altında şunları etkinleştirin:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customer_tags`
   - `unauthenticated_read_content`
5. Kaydedin. **Storefront Access Token**'ı kopyalayın — 7. adımda kullanacaksınız.

#### 4.2 Alternatif: Custom App
1. Shopify Admin → **Settings** → **Apps and sales channels** → **Develop apps**.
2. **Allow custom app development**'a tıklayın (tek seferlik onay).
3. **Create an app** → Uygulama adı girin (örn. "Headless Storefront").
4. **Configuration** → **Storefront API integration** → Yukarıdaki izinleri işaretleyin.
5. **Install app** → **Storefront API access token**'ı kopyalayın.

#### 4.3 Kimlik Bilgilerini Kaydedin
```
SHOPIFY_STORE_DOMAIN = clientname-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN = shpat_xxxxxxxxxxxxxxxxxxxx
```

> **Güvenlik:** Storefront Access Token, herkese açık bir okuma token'ıdır. `.env.local` ve Vercel ortam değişkenlerinde saklayın. Admin API token'ını asla ifşa etmeyin.

---

## 5. Store Content Setup / Mağaza İçeriği Kurulumu

### English

#### 5.1 Products
1. Shopify Admin → **Products** → **Add product**.
2. For each product, fill in:
   - **Title** and **Description** (HTML supported)
   - **Media:** Upload all product images (min. 800×800px, square preferred)
   - **Pricing:** Price and compare-at price (for sale display)
   - **Inventory:** Track quantity if needed
   - **Variants:** Add options (Size, Color, etc.) — each combination becomes a variant
   - **SEO:** Custom URL handle, meta title, meta description

> **Tip:** Export the client's product catalog as a CSV and use Shopify's bulk import (Products → Import) to save time.

#### 5.2 Collections
1. Shopify Admin → **Products** → **Collections** → **Create collection**.
2. Two types:
   - **Manual:** Hand-pick products
   - **Automated:** Products matching conditions (e.g. tag = "summer")
3. Add a **collection image** and **description** for each.
4. Set the collection **handle** (URL slug) carefully — it appears in URLs like `/collections/handle`.

#### 5.3 Navigation Menus
1. Shopify Admin → **Online Store** → **Navigation**.
2. Edit **Main menu** to match the storefront's nav links.
3. The headless storefront uses hardcoded nav for now — keep this in sync manually.

#### 5.4 Store Policies
Fill in all legal pages under **Settings → Policies**:
- Privacy Policy
- Terms of Service
- Refund Policy
- Shipping Policy

These are displayed on the `/shipping` and `/returns` pages of the storefront.

### Türkçe

#### 5.1 Ürünler
1. Shopify Admin → **Products** → **Add product**.
2. Her ürün için doldurun:
   - **Başlık** ve **Açıklama** (HTML desteklenir)
   - **Medya:** Tüm ürün görsellerini yükleyin (min. 800×800px, kare tercih edilir)
   - **Fiyatlandırma:** Fiyat ve karşılaştırma fiyatı (indirim gösterimi için)
   - **Envanter:** Gerekiyorsa stok takibi
   - **Varyantlar:** Seçenekler ekleyin (Beden, Renk vb.) — her kombinasyon bir varyant olur
   - **SEO:** Özel URL handle, meta başlık, meta açıklama

> **İpucu:** Müşterinin ürün kataloğunu CSV olarak alın ve Shopify'ın toplu içe aktarma özelliğini kullanın (Products → Import) — çok zaman kazandırır.

#### 5.2 Koleksiyonlar
1. Shopify Admin → **Products** → **Collections** → **Create collection**.
2. İki tip:
   - **Manuel:** Ürünleri tek tek seçin
   - **Otomatik:** Koşullara uyan ürünler (örn. tag = "yaz")
3. Her koleksiyon için **görsel** ve **açıklama** ekleyin.
4. Koleksiyon **handle**'ını (URL slug) dikkatli belirleyin — `/collections/handle` şeklinde URL'de görünür.

#### 5.3 Navigasyon Menüleri
1. Shopify Admin → **Online Store** → **Navigation**.
2. **Main menu**'yü storefront nav linkleriyle eşleştirin.
3. Headless storefront şu an sabit nav kullanıyor — Shopify menüsüyle manuel senkronize tutun.

#### 5.4 Mağaza Politikaları
**Settings → Policies** altındaki tüm yasal sayfaları doldurun:
- Gizlilik Politikası
- Kullanım Koşulları
- İade Politikası
- Kargo Politikası

Bunlar storefrontun `/shipping` ve `/returns` sayfalarında görüntülenir.

---

## 6. Payment Gateway Setup / Ödeme Altyapısı Kurulumu

### English

#### 6.1 For Testing (Development Store)
1. Shopify Admin → **Settings** → **Payments**.
2. Under **Third-party providers** → Search **"Bogus Gateway"** → Activate.
3. Test cards:
   - `1` → Successful payment
   - `2` → Failed payment
   - `3` → Exception/error
   - Any name, expiry date, and CVV

#### 6.2 For Production

**Turkey-based stores:**

| Provider | Notes |
|----------|-------|
| iyzico | Most common in Turkey. Supports installments (taksit). Requires business registration. |
| PayTR | Popular alternative, good for small businesses. |
| Shopify Payments | Not available in Turkey as of 2026. |
| Stripe | Available but no installment support for Turkish cards. |

**Setup steps (example: iyzico):**
1. Create an iyzico merchant account at [iyzico.com](https://iyzico.com).
2. Complete KYC verification (business documents required).
3. Get API Key and Secret Key from iyzico dashboard.
4. Shopify Admin → Settings → Payments → **Add payment method** → Search "iyzico" → Enter credentials.

#### 6.3 Shopify Payments (International clients)
If available in the client's country:
1. Settings → Payments → **Activate Shopify Payments**.
2. Complete identity verification.
3. Enable **test mode** first, then disable before launch.

### Türkçe

#### 6.1 Test İçin (Geliştirme Mağazası)
1. Shopify Admin → **Settings** → **Payments**.
2. **Third-party providers** → **"Bogus Gateway"** ara → Etkinleştir.
3. Test kartları:
   - `1` → Başarılı ödeme
   - `2` → Başarısız ödeme
   - `3` → Hata/exception
   - Herhangi bir isim, son kullanma tarihi ve CVV

#### 6.2 Canlı Kullanım İçin

**Türkiye merkezli mağazalar:**

| Sağlayıcı | Notlar |
|-----------|--------|
| iyzico | Türkiye'de en yaygın. Taksit desteği var. İşletme kaydı gerektirir. |
| PayTR | Popüler alternatif, küçük işletmeler için uygun. |
| Shopify Payments | 2026 itibarıyla Türkiye'de mevcut değil. |
| Stripe | Kullanılabilir ancak Türk kartları için taksit desteği yok. |

**Kurulum adımları (örnek: iyzico):**
1. [iyzico.com](https://iyzico.com) adresinde merchant hesabı oluşturun.
2. KYC doğrulamasını tamamlayın (işletme belgeleri gerekli).
3. iyzico dashboard'undan API Key ve Secret Key alın.
4. Shopify Admin → Settings → Payments → **Add payment method** → "iyzico" ara → Kimlik bilgilerini girin.

#### 6.3 Shopify Payments (Uluslararası müşteriler)
Müşterinin ülkesinde mevcutsa:
1. Settings → Payments → **Activate Shopify Payments**.
2. Kimlik doğrulamayı tamamlayın.
3. Önce **test modunu** etkinleştirin, yayına almadan önce devre dışı bırakın.

---

## 7. Codebase Configuration / Kod Yapılandırması

### English

#### 7.1 Clone and prepare the repository
```bash
git clone https://github.com/aberkayk/devinbi-shopify.git client-store
cd client-store
npm install
```

#### 7.2 Create environment file
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
SHOPIFY_STORE_DOMAIN=clientname-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxx
```

#### 7.3 Update store-specific content
The following are currently hardcoded and need to be updated per client:

| File | What to change |
|------|----------------|
| `messages/tr.json` | All Turkish UI copy |
| `messages/en.json` | All English UI copy |
| `messages/de.json` | German translations |
| `messages/ar.json` | Arabic translations |
| `app/globals.css` | Brand colors (CSS variables in `:root`) |
| `app/[locale]/layout.tsx` | Font choices, default metadata |
| `app/apple-icon.tsx` | Brand color for Apple icon |
| `app/icon.tsx` | Brand color for favicon |
| `components/layout/Footer.tsx` | Footer links, social media, contact info |
| `components/layout/Navbar.tsx` | Navigation links |

#### 7.4 Update brand colors
In `app/globals.css`, edit the `:root` block:
```css
:root {
  --background: oklch(...);   /* Page background */
  --foreground: oklch(...);   /* Main text */
  --primary: oklch(...);      /* Buttons, accents */
  --primary-foreground: oklch(...); /* Text on primary */
  /* ... */
}
```

Use [oklch.com](https://oklch.com) to convert hex/HSL colors to OKLCH.

#### 7.5 Add/remove locales
Supported locales are configured in `i18n/routing.ts`. Add or remove languages:
```ts
export const routing = defineRouting({
  locales: ['tr', 'en'],   // ← adjust for client
  defaultLocale: 'tr',     // ← client's primary language
})
```

Then add/remove corresponding files in `messages/`.

### Türkçe

#### 7.1 Repository'yi klonlayın ve hazırlayın
```bash
git clone https://github.com/aberkayk/devinbi-shopify.git client-store
cd client-store
npm install
```

#### 7.2 Ortam dosyası oluşturun
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
SHOPIFY_STORE_DOMAIN=clientname-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxx
```

#### 7.3 Mağazaya özel içeriği güncelleyin
Şu an hardcoded olan ve her müşteri için güncellenmesi gereken dosyalar:

| Dosya | Ne değiştirilecek |
|-------|-------------------|
| `messages/tr.json` | Tüm Türkçe UI metinleri |
| `messages/en.json` | Tüm İngilizce UI metinleri |
| `messages/de.json` | Almanca çeviriler |
| `messages/ar.json` | Arapça çeviriler |
| `app/globals.css` | Marka renkleri (`:root` içindeki CSS değişkenleri) |
| `app/[locale]/layout.tsx` | Font seçimleri, varsayılan metadata |
| `app/apple-icon.tsx` | Apple ikonu için marka rengi |
| `app/icon.tsx` | Favicon için marka rengi |
| `components/layout/Footer.tsx` | Footer linkleri, sosyal medya, iletişim |
| `components/layout/Navbar.tsx` | Navigasyon linkleri |

#### 7.4 Marka renklerini güncelleyin
`app/globals.css` dosyasında `:root` bloğunu düzenleyin:
```css
:root {
  --background: oklch(...);        /* Sayfa arkaplanı */
  --foreground: oklch(...);        /* Ana metin */
  --primary: oklch(...);           /* Butonlar, vurgular */
  --primary-foreground: oklch(...); /* Primary üzerindeki metin */
  /* ... */
}
```

Hex/HSL renkleri OKLCH'ye dönüştürmek için [oklch.com](https://oklch.com) kullanın.

#### 7.5 Dil desteğini ayarlayın
Desteklenen diller `i18n/routing.ts` dosyasında yapılandırılır:
```ts
export const routing = defineRouting({
  locales: ['tr', 'en'],   // ← müşteriye göre ayarlayın
  defaultLocale: 'tr',     // ← müşterinin birincil dili
})
```

Ardından `messages/` klasöründe ilgili dosyaları ekleyin/kaldırın.

---

## 8. Deployment to Vercel / Vercel'e Deploy

### English

#### 8.1 Push to a new GitHub repository
```bash
git remote set-url origin https://github.com/YOUR_ORG/client-store.git
git push -u origin main
```

Or create a new private repo and push:
```bash
git remote add origin https://github.com/YOUR_ORG/client-store.git
git push -u origin main
```

#### 8.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Import the GitHub repository.
3. Framework preset: **Next.js** (auto-detected).
4. **Environment Variables** — add:
   ```
   SHOPIFY_STORE_DOMAIN = clientname-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN = shpat_xxxxxxxxxxxxxxxxxxxx
   ```
5. Click **Deploy**.

#### 8.3 Verify deployment
- Visit the Vercel preview URL (e.g. `client-store.vercel.app`)
- Check all pages: home, collections, product detail, cart, search
- Test add-to-cart and checkout flow

### Türkçe

#### 8.1 Yeni GitHub repository'sine push edin
```bash
git remote set-url origin https://github.com/YOUR_ORG/client-store.git
git push -u origin main
```

#### 8.2 Vercel'e deploy edin
1. [vercel.com](https://vercel.com) → **Add New Project**.
2. GitHub repository'sini import edin.
3. Framework preset: **Next.js** (otomatik algılanır).
4. **Environment Variables** ekleyin:
   ```
   SHOPIFY_STORE_DOMAIN = clientname-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN = shpat_xxxxxxxxxxxxxxxxxxxx
   ```
5. **Deploy**'a tıklayın.

#### 8.3 Deploy'u doğrulayın
- Vercel preview URL'ini ziyaret edin (örn. `client-store.vercel.app`)
- Tüm sayfaları kontrol edin: ana sayfa, koleksiyonlar, ürün detay, sepet, arama
- Sepete ekleme ve checkout akışını test edin

---

## 9. Domain Setup / Domain Kurulumu

### English

#### 9.1 Purchase the domain
Recommended registrars (cheapest to most expensive):
- [Porkbun](https://porkbun.com) — cheapest, excellent UI
- [Namecheap](https://namecheap.com) — reliable, good support
- [Google Domains / Squarespace](https://domains.squarespace.com)
- [GoDaddy](https://godaddy.com) — widely known but pricier

#### 9.2 Add domain to Shopify
1. Shopify Admin → **Settings** → **Domains** → **Add existing domain**.
2. Enter the domain (e.g. `shop.clientdomain.com`).
3. Shopify will show DNS records to configure.

#### 9.3 Configure DNS at your registrar

For an apex domain (`clientdomain.com`):
```
Type  Host  Value
A     @     23.227.38.65   (Shopify's IP)
CNAME www   shops.myshopify.com
```

For a subdomain (`shop.clientdomain.com`):
```
Type   Host   Value
CNAME  shop   clientname-store.myshopify.com
```

Wait 24–48 hours for DNS propagation, then click **Verify connection** in Shopify.

#### 9.4 Add domain to Vercel
1. Vercel project → **Settings** → **Domains** → Add the same domain.
2. Configure DNS CNAME to point to `cname.vercel-dns.com`.

> **Note:** The domain connects to EITHER Shopify (for checkout) OR Vercel (for the storefront). For a headless setup, the storefront domain points to Vercel, and Shopify uses the same domain for checkout after you add it in Shopify Admin as well.

#### 9.5 SSL
Both Vercel and Shopify provision SSL certificates automatically. No manual setup needed.

### Türkçe

#### 9.1 Domain satın alın
Önerilen kayıt şirketleri (ucuzdan pahalıya):
- [Porkbun](https://porkbun.com) — en ucuz, mükemmel arayüz
- [Namecheap](https://namecheap.com) — güvenilir, iyi destek
- [Google Domains / Squarespace](https://domains.squarespace.com)
- [GoDaddy](https://godaddy.com) — yaygın bilinir ama daha pahalı

#### 9.2 Domain'i Shopify'a ekleyin
1. Shopify Admin → **Settings** → **Domains** → **Add existing domain**.
2. Domain'i girin (örn. `shop.clientdomain.com`).
3. Shopify yapılandırılacak DNS kayıtlarını gösterecektir.

#### 9.3 Domain sağlayıcınızda DNS yapılandırın

Ana domain için (`clientdomain.com`):
```
Tip    Host  Değer
A      @     23.227.38.65   (Shopify'ın IP'si)
CNAME  www   shops.myshopify.com
```

Subdomain için (`shop.clientdomain.com`):
```
Tip    Host   Değer
CNAME  shop   clientname-store.myshopify.com
```

DNS yayılması için 24–48 saat bekleyin, ardından Shopify'da **Verify connection**'a tıklayın.

#### 9.4 Domain'i Vercel'e ekleyin
1. Vercel projesi → **Settings** → **Domains** → Aynı domain'i ekleyin.
2. DNS CNAME'ini `cname.vercel-dns.com`'a yönlendirin.

> **Not:** Domain ya Shopify'a (checkout için) ya da Vercel'e (storefront için) bağlanır. Headless kurulumda storefront domain'i Vercel'e işaret eder ve aynı domain Shopify Admin'e de eklendiğinde Shopify checkout da bu domain'i kullanır.

#### 9.5 SSL
Vercel ve Shopify SSL sertifikalarını otomatik olarak sağlar. Manuel kurulum gerekmez.

---

## 10. Localization / Lokalizasyon

### English

#### 10.1 Shopify-side translations
1. Shopify Admin → **Settings** → **Languages**.
2. Add all required languages.
3. Translate product titles, descriptions, and collection names using Shopify's built-in translation editor or the **Translate & Adapt** app (free).

#### 10.2 Storefront UI translations
All UI strings live in `messages/` directory:
- `messages/tr.json` — Turkish
- `messages/en.json` — English
- `messages/de.json` — German
- `messages/ar.json` — Arabic

To add a new language (e.g. French):
1. Create `messages/fr.json` (copy `en.json` and translate).
2. Add `'fr'` to `locales` array in `i18n/routing.ts`.
3. Deploy.

#### 10.3 RTL support (Arabic)
Arabic (`ar`) is a right-to-left language. Add `dir="rtl"` support to the layout:
```tsx
// app/[locale]/layout.tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### Türkçe

#### 10.1 Shopify tarafında çeviriler
1. Shopify Admin → **Settings** → **Languages**.
2. Gerekli tüm dilleri ekleyin.
3. Ürün başlıklarını, açıklamalarını ve koleksiyon adlarını Shopify'ın yerleşik çeviri editörü veya ücretsiz **Translate & Adapt** uygulamasıyla çevirin.

#### 10.2 Storefront UI çevirileri
Tüm UI metinleri `messages/` klasöründe bulunur:
- `messages/tr.json` — Türkçe
- `messages/en.json` — İngilizce
- `messages/de.json` — Almanca
- `messages/ar.json` — Arapça

Yeni dil eklemek için (örn. Fransızca):
1. `messages/fr.json` oluşturun (`en.json`'ı kopyalayıp çevirin).
2. `i18n/routing.ts` dosyasındaki `locales` dizisine `'fr'` ekleyin.
3. Deploy edin.

#### 10.3 RTL desteği (Arapça)
Arapça (`ar`) sağdan sola bir dildir. Layout'a `dir="rtl"` desteği ekleyin:
```tsx
// app/[locale]/layout.tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

---

## 11. Testing Checklist / Test Kontrol Listesi

### English
Run through this checklist before going live:

**Pages**
- [ ] Home page loads and shows featured products
- [ ] Collections page lists all collections
- [ ] Collection detail page shows products with correct filters
- [ ] Product detail page shows images, variants, price, stock status
- [ ] Cart page shows items, quantities, totals
- [ ] Search returns relevant results
- [ ] Contact / Shipping / Returns pages display correct content
- [ ] 404 page works

**Cart & Checkout**
- [ ] Add to cart from product page works
- [ ] Add to cart from collection card works
- [ ] Cart drawer opens and shows correct items
- [ ] Cart icon badge shows correct count
- [ ] Update quantity in cart drawer works
- [ ] Remove item from cart works
- [ ] Checkout button redirects to Shopify checkout
- [ ] Complete a test purchase with Bogus Gateway card `1`
- [ ] Order appears in Shopify Admin → Orders

**Localization**
- [ ] Language switcher changes locale correctly
- [ ] All UI strings appear in correct language
- [ ] Product content from Shopify appears in correct language (if translated)
- [ ] Currency displays correctly

**Performance**
- [ ] Lighthouse score > 80 on mobile
- [ ] No LCP warnings in browser console
- [ ] Images load quickly

**Mobile**
- [ ] All pages are responsive on 375px and 768px width
- [ ] Cart drawer works on mobile
- [ ] Checkout is usable on mobile

### Türkçe
Yayına almadan önce bu kontrol listesini çalıştırın:

**Sayfalar**
- [ ] Ana sayfa yükleniyor ve öne çıkan ürünleri gösteriyor
- [ ] Koleksiyonlar sayfası tüm koleksiyonları listeliyor
- [ ] Koleksiyon detay sayfası ürünleri doğru şekilde gösteriyor
- [ ] Ürün detay sayfası görseller, varyantlar, fiyat ve stok durumunu gösteriyor
- [ ] Sepet sayfası ürünleri, miktarları ve toplamları gösteriyor
- [ ] Arama ilgili sonuçları döndürüyor
- [ ] İletişim / Kargo / İadeler sayfaları doğru içeriği gösteriyor
- [ ] 404 sayfası çalışıyor

**Sepet & Checkout**
- [ ] Ürün sayfasından sepete ekleme çalışıyor
- [ ] Koleksiyon kartından sepete ekleme çalışıyor
- [ ] Sepet drawer açılıyor ve doğru ürünleri gösteriyor
- [ ] Sepet ikonu rozeti doğru sayıyı gösteriyor
- [ ] Drawer'da miktar güncelleme çalışıyor
- [ ] Sepetten ürün silme çalışıyor
- [ ] Checkout butonu Shopify checkout'a yönlendiriyor
- [ ] Bogus Gateway kartı `1` ile test satın alımı tamamlanıyor
- [ ] Sipariş Shopify Admin → Orders'da görünüyor

**Lokalizasyon**
- [ ] Dil değiştirici doğru locale'e geçiyor
- [ ] Tüm UI metinleri doğru dilde görünüyor
- [ ] Shopify'dan gelen ürün içerikleri doğru dilde görünüyor (çevrildiyse)
- [ ] Para birimi doğru görüntüleniyor

**Performans**
- [ ] Mobilde Lighthouse skoru > 80
- [ ] Tarayıcı konsolunda LCP uyarısı yok
- [ ] Görseller hızlı yükleniyor

**Mobil**
- [ ] Tüm sayfalar 375px ve 768px genişliğinde responsive
- [ ] Sepet drawer mobilde çalışıyor
- [ ] Checkout mobilde kullanılabilir

---

## 12. Go-Live Checklist / Yayına Alma Kontrol Listesi

### English

**Shopify Admin**
- [ ] Remove Bogus Gateway, activate real payment provider
- [ ] Disable test mode on payment provider
- [ ] All products are published (not draft)
- [ ] Store policies are filled in (Privacy, Terms, Refund, Shipping)
- [ ] Shipping rates are configured
- [ ] Tax settings are correct for the client's country
- [ ] Email notifications are configured (order confirmation, shipping, etc.)
- [ ] Custom domain is added and verified

**Vercel**
- [ ] Production environment variables are set (not test values)
- [ ] Custom domain is added to Vercel project
- [ ] Deploy succeeded with no build errors

**DNS**
- [ ] Domain DNS is pointing to correct values
- [ ] SSL certificate is active (green lock in browser)

**Final**
- [ ] Do one final end-to-end test with a real (or small-amount) purchase
- [ ] Share store URL with client for approval
- [ ] Transfer store ownership to client if using Partner account

### Türkçe

**Shopify Admin**
- [ ] Bogus Gateway kaldırın, gerçek ödeme sağlayıcısını etkinleştirin
- [ ] Ödeme sağlayıcısında test modunu devre dışı bırakın
- [ ] Tüm ürünler yayınlandı (taslak değil)
- [ ] Mağaza politikaları dolduruldu (Gizlilik, Koşullar, İade, Kargo)
- [ ] Kargo ücretleri yapılandırıldı
- [ ] Vergi ayarları müşterinin ülkesi için doğru
- [ ] E-posta bildirimleri yapılandırıldı (sipariş onayı, kargo vb.)
- [ ] Özel domain eklendi ve doğrulandı

**Vercel**
- [ ] Production ortam değişkenleri ayarlandı (test değerleri değil)
- [ ] Özel domain Vercel projesine eklendi
- [ ] Deploy başarılı, build hatası yok

**DNS**
- [ ] Domain DNS doğru değerlere işaret ediyor
- [ ] SSL sertifikası aktif (tarayıcıda yeşil kilit)

**Son**
- [ ] Gerçek (veya küçük tutarlı) bir satın alımla son uçtan uca test yapın
- [ ] Mağaza URL'ini müşteri onayı için paylaşın
- [ ] Partner hesabı kullanıyorsanız mağaza sahipliğini müşteriye devredin

---

## 13. Post-Launch / Yayın Sonrası

### English

#### 13.1 Transfer store ownership (Partner stores)
1. Partner Dashboard → Select the store → **Transfer ownership**.
2. Enter the client's email address.
3. Client receives an invitation to create/link a Shopify account and choose a paid plan.
4. Once accepted, the store moves to their billing.

#### 13.2 Handoff documentation
Provide the client with:
- Store admin URL (`clientname-store.myshopify.com/admin`)
- Login credentials or instructions to create their own admin account
- Guide to adding/editing products
- Guide to viewing orders
- Contact for support

#### 13.3 Ongoing maintenance
- **Shopify plan:** The client must subscribe to a paid Shopify plan (Basic starts at $25/month).
- **Vercel plan:** Free tier covers most small stores. Pro plan needed for high traffic.
- **Domain renewal:** Remind the client to renew their domain annually.
- **Dependency updates:** Review `package.json` for outdated packages every few months.

### Türkçe

#### 13.1 Mağaza sahipliğini devredin (Partner mağazaları)
1. Partner Dashboard → Mağazayı seçin → **Transfer ownership**.
2. Müşterinin e-posta adresini girin.
3. Müşteri, Shopify hesabı oluşturmak/bağlamak ve ücretli plan seçmek için davet alır.
4. Kabul edildiğinde mağaza onların faturasına geçer.

#### 13.2 Teslim belgeleri
Müşteriye şunları sağlayın:
- Mağaza admin URL'i (`clientname-store.myshopify.com/admin`)
- Giriş bilgileri veya kendi admin hesabını oluşturma talimatları
- Ürün ekleme/düzenleme kılavuzu
- Siparişleri görüntüleme kılavuzu
- Destek için iletişim bilgileri

#### 13.3 Süregelen bakım
- **Shopify planı:** Müşteri ücretli bir Shopify planına abone olmalıdır (Basic $25/ay'dan başlar).
- **Vercel planı:** Ücretsiz tier küçük mağazaların çoğunu karşılar. Yüksek trafik için Pro plan gerekir.
- **Domain yenileme:** Müşteriyi domain'i her yıl yenilemesi için uyarın.
- **Bağımlılık güncellemeleri:** Her birkaç ayda bir `package.json`'daki eski paketleri gözden geçirin.

---

## 14. Environment Variables Reference / Ortam Değişkenleri Referansı

| Variable | Required | Description / Açıklama |
|----------|----------|------------------------|
| `SHOPIFY_STORE_DOMAIN` | ✅ | `clientname-store.myshopify.com` — no `https://` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | ✅ | Storefront API public token (`shpat_...`) |

> These are the only two environment variables required. Both must be set in Vercel's project settings for production deployments.
>
> Bu iki ortam değişkeni gereklidir. Her ikisi de production deploy için Vercel proje ayarlarında tanımlanmalıdır.

---

*Last updated: 2026-05-13*
