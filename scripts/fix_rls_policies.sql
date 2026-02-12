-- =====================================================
-- RLS POLİTİKA DÜZELTME SCRIPTİ
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

-- Mevcut sonsuz döngüye neden olan politikaları kaldır
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON profiles;
DROP POLICY IF EXISTS "Enable write access for users" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Tüm mevcut politikaları kontrol et ve temizle
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- =====================================================
-- YENİ RLS POLİTİKALARI (Sonsuz döngü olmadan)
-- =====================================================

-- SELECT: Kullanıcılar sadece kendi profillerini görebilir
-- auth.uid() kullanarak doğrudan karşılaştırma (profiles tablosuna başvuru yok)
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- INSERT: Kullanıcılar sadece kendi ID'leri ile profil ekleyebilir
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- UPDATE: Kullanıcılar sadece kendi profillerini güncelleyebilir
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- DELETE: Kullanıcılar kendi profillerini silebilir (isteğe bağlı)
CREATE POLICY "profiles_delete_own" ON profiles
    FOR DELETE 
    USING (auth.uid() = id);

-- =====================================================
-- RLS'in aktif olduğunu doğrula
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- AÇIKLAMA:
-- Eski politikalar muhtemelen şu şekildeydi:
--   USING (EXISTS (SELECT 1 FROM profiles WHERE ...))
-- Bu profiles tablosunu kendi politikasında sorguladığı için
-- sonsuz döngüye neden oluyordu.
--
-- Yeni politikalar doğrudan auth.uid() = id karşılaştırması
-- yapıyor, bu yüzden herhangi bir alt sorgu yok ve döngü yok.
-- =====================================================
