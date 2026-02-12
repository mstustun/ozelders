# Özel Ders Platformu — Sistem Raporu

**Tarih:** 12 Şubat 2026  
**Proje Dizini:** `/Users/mesutustun/Desktop/proje`  
**GitHub:** [https://github.com/mstustun/ozelders](https://github.com/mstustun/ozelders)

---

## 1. Proje Genel Bakış

Özel ders öğrencileri için geliştirilmiş bir web platformu. Öğretmen ve öğrenci rolleri ile giriş/kayıt sistemi, dashboard'lar ve rol bazlı erişim kontrolü içerir.

### Temel Özellikler
- 🔐 Kullanıcı kaydı ve girişi (email/şifre)
- 👨‍🏫 Öğretmen dashboard'u (öğrenci listesi, istatistikler)
- 👨‍🎓 Öğrenci dashboard'u (hızlı erişim kartları, bilgi paneli)
- 🛡️ Rol bazlı yetkilendirme (teacher/student)
- 🔄 Otomatik yönlendirme (giriş yapan kullanıcı rolüne göre dashboard'a yönlendirilir)
- 🎨 Modern glassmorphism tasarım, animasyonlar

---

## 2. Teknoloji Stack

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| **Frontend Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.2.4 |
| **CSS** | TailwindCSS v4 + Custom CSS | 4.1.18 |
| **Routing** | React Router DOM | 7.13.0 |
| **Backend/Auth** | Supabase | 2.91.1 |
| **Linting** | ESLint | 9.39.1 |
| **Dil** | JavaScript (JSX) | ES Modules |

---

## 3. Dosya Yapısı

```
proje/
├── .env                          # Supabase yapılandırması (git'te yok)
├── .gitignore
├── index.html                    # Ana HTML dosyası
├── package.json
├── vite.config.js                # Vite + React + Tailwind yapılandırması
├── eslint.config.js
├── scripts/
│   ├── create_test_users.sql     # Test kullanıcıları oluşturma scripti
│   └── fix_rls_policies.sql      # RLS politika düzeltme scripti
├── public/
│   └── vite.svg
├── src/
│   ├── main.jsx                  # Uygulama giriş noktası
│   ├── App.jsx                   # Ana bileşen, routing tanımları
│   ├── index.css                 # Tüm CSS (glassmorphism, butonlar, animasyonlar)
│   ├── assets/
│   │   └── react.svg
│   ├── lib/
│   │   └── supabase.js           # Supabase client + mock client
│   ├── contexts/
│   │   └── AuthContext.jsx       # Kimlik doğrulama context'i
│   ├── components/
│   │   └── auth/
│   │       ├── LoginForm.jsx     # Giriş formu bileşeni
│   │       ├── RegisterForm.jsx  # Kayıt formu bileşeni
│   │       └── ProtectedRoute.jsx # Korumalı route bileşeni
│   └── pages/
│       ├── Home.jsx              # Ana sayfa (hero + özellik kartları)
│       ├── Login.jsx             # Giriş sayfası wrapper
│       ├── Register.jsx          # Kayıt sayfası wrapper
│       ├── TeacherDashboard.jsx  # Öğretmen paneli
│       └── StudentDashboard.jsx  # Öğrenci paneli
└── dist/                         # Build çıktısı
```

---

## 4. Sayfa ve Bileşen Detayları

### 4.1 Ana Sayfa (`Home.jsx`)
- Hero section: Başlık, açıklama, "Giriş Yap" ve "Kayıt Ol" butonları
- 3 özellik kartı: Ders Takibi, Ödev Yönetimi, Öğretmen İletişimi
- Giriş yapmış kullanıcıları rollerine göre otomatik yönlendirme
- Supabase yapılandırılmamışsa uyarı gösterimi
- Footer: "© 2026 Özel Ders Platformu"

### 4.2 Giriş Formu (`LoginForm.jsx`)
- Email ve şifre alanları
- Form doğrulama (required)
- Hata mesajları (Türkçe)
- Loading spinner
- Kayıt sayfasına link

### 4.3 Kayıt Formu (`RegisterForm.jsx`)
- Ad Soyad, Email, Şifre, Şifre Tekrar alanları
- Şifre eşleşme kontrolü
- Minimum 6 karakter şifre kontrolü
- Kayıt sonrası başarı mesajı ("Email adresinizi kontrol edin")
- Her kayıt olan kullanıcı otomatik olarak **student** rolü alır

### 4.4 Öğretmen Dashboard (`TeacherDashboard.jsx`)
- Hoş geldiniz başlığı + öğretmen adı
- 3 istatistik kartı: Toplam Öğrenci, Aktif Öğrenciler, Bu Hafta Ders
- Öğrenci listesi (Supabase'den `profiles` tablosundan çekilir)
- Her öğrenci için avatar (ilk harf), ad ve email gösterimi
- Çıkış yap butonu

### 4.5 Öğrenci Dashboard (`StudentDashboard.jsx`)
- Hoş geldiniz kartı (avatar + ad + email)
- 3 hızlı erişim kartı: Ders Programım, Ödevlerim, Notlarım (hepsi "Yakında" olarak işaretli)
- Bilgi kartı: "Yakında daha fazla özellik eklenecek"
- Çıkış yap butonu

### 4.6 Korumalı Route (`ProtectedRoute.jsx`)
- Giriş yapmamış kullanıcıları `/login`'e yönlendirir
- Yanlış role sahip kullanıcıları doğru dashboard'a yönlendirir
- Loading durumunda spinner gösterir

---

## 5. Kimlik Doğrulama Sistemi

### 5.1 AuthContext (`AuthContext.jsx`)
Uygulamanın merkezi auth yönetimi:

| Fonksiyon | Açıklama |
|-----------|----------|
| `signUp(email, password, fullName, role)` | Yeni kullanıcı kaydı + profil oluşturma |
| `signIn(email, password)` | Email/şifre ile giriş |
| `signOut()` | Çıkış yapma |
| `fetchProfile(userId)` | Kullanıcı profil bilgilerini çekme |

**Sağladığı değerler:** `user`, `profile`, `loading`, `signUp`, `signIn`, `signOut`, `isTeacher`, `isStudent`

### 5.2 Supabase Client (`supabase.js`)
- Gerçek Supabase client veya mock client oluşturur
- Mock client: Supabase yapılandırılmamışsa uygulamanın çökmesini engeller
- URL ve Key `.env` dosyasından okunur

### 5.3 Supabase Yapılandırması (`.env`)
```
VITE_SUPABASE_URL=https://byzzedhduplkrqzbgaxy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 6. Veritabanı Yapısı (Supabase)

### `profiles` Tablosu
| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID | Supabase Auth user ID (PK) |
| `email` | TEXT | Kullanıcı email adresi |
| `full_name` | TEXT | Ad Soyad |
| `role` | TEXT | `teacher` veya `student` |
| `created_at` | TIMESTAMP | Oluşturulma tarihi |

### RLS (Row Level Security) Politikaları
- **SELECT:** Kullanıcılar sadece kendi profillerini görebilir
- **INSERT:** Kullanıcılar sadece kendi ID'leri ile profil ekleyebilir
- **UPDATE:** Kullanıcılar sadece kendi profillerini güncelleyebilir
- **DELETE:** Kullanıcılar kendi profillerini silebilir

> ⚠️ Öğretmen dashboard'u tüm öğrenci profillerini çekmeye çalışıyor ama mevcut RLS politikaları buna izin vermiyor. Bu bir potansiyel sorun olabilir.

---

## 7. Route (Yönlendirme) Yapısı

| Path | Bileşen | Erişim | Açıklama |
|------|---------|--------|----------|
| `/` | Home | Herkese açık | Ana sayfa |
| `/login` | Login | Herkese açık | Giriş sayfası |
| `/register` | Register | Herkese açık | Kayıt sayfası |
| `/teacher` | TeacherDashboard | Sadece öğretmen | Öğretmen paneli |
| `/student` | StudentDashboard | Sadece öğrenci | Öğrenci paneli |
| `/dashboard` | RoleBasedRedirect | Giriş yapmış | Role göre yönlendirme |
| `*` | Navigate → `/` | Herkese açık | Bilinmeyen URL'ler ana sayfaya yönlendirilir |

---

## 8. CSS ve Tasarım Sistemi

### Renk Paleti
| Değişken | Renk | Kullanım |
|----------|------|----------|
| `--primary` | `#6366f1` (Indigo) | Ana renk, butonlar |
| `--secondary` | `#8b5cf6` (Mor) | Gradyanlar |
| `--accent` | `#06b6d4` (Cyan) | Öğrenci badge'leri |
| `--bg-gradient` | Koyu mor gradyan | Arka plan |
| `--glass-bg` | `rgba(255,255,255,0.1)` | Glassmorphism kartları |

### Bileşen Stilleri
- **`.glass-card`** — Glassmorphism kartlar (blur + border + hover efekti)
- **`.btn-primary`** — Gradyan buton (indigo → mor)
- **`.btn-secondary`** — Yarı saydam cam buton
- **`.input`** — Yarı saydam giriş alanları
- **`.badge-teacher`** — Öğretmen etiketi
- **`.badge-student`** — Öğrenci etiketi
- **`.spinner`** — Yükleme animasyonu

### Animasyonlar
- `fadeIn` — Yukarıdan aşağı kayarak belirme
- `slideIn` — Soldan sağa kayarak belirme
- `spin` — Spinner döndürme

---

## 9. Test Kullanıcıları

| Email | Şifre | Rol | Ad |
|-------|-------|-----|----|
| `teacher@test.com` | `Test123!` | teacher | Ahmet Öğretmen |
| `student1@test.com` | `Test123!` | student | Ayşe Öğrenci |
| `student2@test.com` | `Test123!` | student | Mehmet Öğrenci |

---

## 10. Bilinen Sorunlar

### 🔴 Kritik
1. **Supabase URL erişilemiyor** — `byzzedhduplkrqzbgaxy.supabase.co` çözümlenemiyor (`ERR_NAME_NOT_RESOLVED`). Supabase projesi muhtemelen dondurulmuş veya silinmiş.
2. **Ana sayfa sonsuz yükleme** — Supabase erişilemeyince `AuthContext` loading state'ten çıkamıyor, ana sayfa hep "Yükleniyor..." gösteriyor.

### 🟡 Kod Kalitesi (ESLint Hataları)
3. **`fetchProfile` erken kullanım** — `AuthContext.jsx:25` — Fonksiyon tanımlanmadan önce kullanılıyor.
4. **Kullanılmayan `navigate`** — `RegisterForm.jsx:14` — `navigate` değişkeni tanımlanıp hiç kullanılmıyor.
5. **`window.location.href` kullanımı** — `Home.jsx:22-25` — React'te `window.location.href` yerine `<Navigate>` veya `useNavigate` kullanılmalı.

### 🟠 Potansiyel Sorunlar
6. **RLS ve Öğretmen Erişimi** — Öğretmen dashboard öğrenci listesini çekerken, RLS politikaları sadece kendi profilini görmeye izin veriyor. Öğretmenin öğrenci profillerini görememesi veritabanı düzeyinde bir çakışma.
7. **`.env` güvenliği** — `.gitignore`'da `.env` tanımlı değildi, manuel olarak git'ten çıkardım.
8. **Email doğrulama** — Kayıt sonrası email doğrulama mesajı gösteriliyor ama Supabase erişilemediğinden test edilemiyor.

---

## 11. Build Durumu

```
✅ Build Başarılı (vite build)
✓ 89 modül dönüştürüldü
✓ 901ms'de tamamlandı

Çıktı dosyaları:
  dist/index.html                   0.45 kB
  dist/assets/index-B2P-Az5L.css   22.11 kB (gzip: 4.95 kB)
  dist/assets/index-QY5-GvA_.js   423.11 kB (gzip: 122.34 kB)
```

---

## 12. Öneriler

1. **Supabase projesini yeniden aktifleştirin** veya yeni bir Supabase projesi oluşturup `.env` dosyasını güncelleyin.
2. **ESLint hatalarını giderin** — özellikle `fetchProfile` sıralaması ve `window.location.href` kullanımı.
3. **RLS politikalarına öğretmen erişimi ekleyin** — öğretmenlerin öğrenci profillerini görebilmesi için ek politika gerekli.
4. **`.env`'yi `.gitignore`'a ekleyin** — hassas bilgilerin GitHub'a yüklenmesini kalıcı olarak engelleyin.
5. **Ders programı, ödev yönetimi ve notlar** özelliklerini geliştirin (şu an "Yakında" olarak işaretli).
6. **Hata yönetimini iyileştirin** — Supabase erişilemezse loading state'te takılmak yerine kullanıcıya anlamlı hata mesajı gösterin.
