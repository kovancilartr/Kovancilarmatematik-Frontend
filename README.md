# LearnApp Frontend

Bu proje, uzaktan eğitim platformu için geliştirilmiş modern bir web arayüzüdür. **Next.js 16** ve **React 19** kullanılarak, en güncel web teknolojileriyle inşa edilmiştir. Şık ve duyarlı (responsive) tasarımı, **Tailwind CSS v4** ve **Shadcn/UI** kütüphaneleri ile sağlanmaktadır.

## 🚀 Teknolojiler

Proje, performans ve geliştirici deneyimi odaklı modern bir teknoloji yığınına sahiptir:

-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
-   **Dil**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Bileşenleri**: [Shadcn/UI](https://ui.shadcn.com/) (Radix UI tabanlı)
-   **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
-   **Form Yönetimi**: [React Hook Form](https://react-hook-form.com/)
-   **Validasyon**: [Zod](https://zod.dev/)
-   **Video Oynatıcı**: [Plyr.io](https://github.com/chintan9/plyr-react)
-   **İkonlar**: [Lucide React](https://lucide.dev/)
-   **Bildirimler**: [Sonner](https://sonner.emilkowal.ski/) ve [React Hot Toast](https://react-hot-toast.com/)

## 🛠 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Gereksinimler

-   Node.js (v18 veya üzeri)

### 2. Bağımlılıkları Yükleme

Proje klasörüne gidin ve paketleri yükleyin:

```bash
cd frontend
npm install
```

### 3. Çevresel Değişkenler (.env)

Kök dizinde `.env.local` dosyasını oluşturun ve Backend API adresinizi belirtin:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 4. Başlatma

Geliştirme sunucusunu başlatın:

```bash
npm run dev
# Proje http://localhost:3001 veya http://localhost:3000 adresinde çalışacaktır.
```

Prodüksiyon için build alma:
```bash
npm run build
npm start
```

## 🏗 Proje Yapısı

Proje, Next.js App Router yapısını ve modüler bir mimariyi takip eder:

```
frontend/
├── app/                  # Sayfalar ve Rota Grupları
│   ├── [locale]/         # i18n Desteği
│   │   ├── (public)/     # Herkese açık sayfalar (Ana sayfa, Kurs Vitrini)
│   │   ├── (admin)/      # Yönetim paneli (Sadece Admin/Öğretmen)
│   │   ├── (course-player)/ # Ders izleme arayüzü (Özel Layout)
│   │   └── login/        # Giriş sayfası
├── components/           # Tekrar kullanılabilir arayüz bileşenleri
│   ├── ui/               # Shadcn temel bileşenleri (Button, Input, vb.)
│   ├── forms/            # Form bileşenleri
│   ├── layout/           # Header, Footer, Sidebar vb.
│   └── modal/            # Pop-up modallar (Ekleme/Düzenleme işlemleri için)
├── hooks/                # Özel React Hook'ları (API çağrıları burada toplanır)
├── lib/                  # Yardımcı kütüphaneler (API istemcisi, utils)
└── public/               # Statik dosyalar
```

## 🌟 Öne Çıkan Özellikler

### 👥 Kullanıcı Arayüzü (Public)
-   **Dinamik Ana Sayfa:** Modern ve animasyonlu karşılama ekranı.
-   **Kurs Vitrini:** Kategorilere ayrılmış kurslar, detay sayfaları ve müfredat önizlemesi.
-   **Video Oynatıcı:** Gelişmiş video kontrolleri, video bittiğinde otomatik tamamlama.
-   **Güvenlik:** Yetkisiz erişim denemelerinde özel "Erişim Reddedildi" ekranı.

### 🛡 Yönetim Paneli (Admin)
-   **Kurs Yönetimi:** Kategori, Konu ve Ders ekleme/düzenleme/silme.
-   **Soru Bankası:** Zengin içerikli soru oluşturma (Görsel destekli, şıklı).
-   **Test Sistemi:** Kazanım bazlı test oluşturma ve öğrencilere atama.
-   **Kullanıcı Yönetimi:** Öğrenci ve öğretmenleri listeleme ve yönetme.
-   **Atamalar & İzinler:** Özel (Private) kursları sadece belirli öğrencilere atama arayüzü.

### ⚡ Teknik Özellikler
-   **Admin Cache Stratejisi:** Admin panelde veriler her zaman günceldir.
-   **Akıllı Hata Yönetimi:** 403/404 hatalarında gereksiz API tekrar istekleri (retry) engellenir.
-   **Race Condition Koruması:** Admin girişi sırasında token yüklenme sürecini bekleyen özel mekanizma.
-   **Responsive Tasarım:** Mobil, Tablet ve Masaüstü uyumlu.

---
**Geliştirici:** Kovancılar Matematik Yazılım Ekibi
**Tarih:** 2026