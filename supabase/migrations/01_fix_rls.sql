-- =====================================================
-- RLS POLİTİKA DÜZELTMESİ
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

-- Mevcut tüm profiles politikalarını temizle
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
-- YENİ RLS POLİTİKALARI
-- =====================================================

-- RLS aktif olduğundan emin ol
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Kullanıcı kendi profilini görebilir
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 2. INSERT: Kullanıcılar sadece kendi ID'leri ile profil ekleyebilir
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 3. UPDATE: Kullanıcılar sadece kendi profillerini güncelleyebilir
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. DELETE: Kullanıcılar kendi profillerini silebilir
CREATE POLICY "profiles_delete_own" ON profiles
    FOR DELETE
    USING (auth.uid() = id);

-- 5. SELECT: Öğretmenler öğrenci profillerini görebilir (arama/ekleme için)
CREATE POLICY "teachers_can_view_students" ON profiles
    FOR SELECT
    USING (
        auth.uid() = id
        OR (
            role = 'student'
            AND EXISTS (
                SELECT 1 FROM profiles AS p
                WHERE p.id = auth.uid() AND p.role = 'teacher'
            )
        )
    );

-- =====================================================
-- AÇIKLAMA:
-- profiles_select_own: Herkes kendi profilini görebilir
-- teachers_can_view_students: Öğretmenler öğrenci profillerini görebilir
-- =====================================================
