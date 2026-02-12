-- =====================================================
-- TEST KULLANICILARI PROFİL OLUŞTURMA SCRIPTİ
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

-- Auth kullanıcıları zaten oluşturuldu, şimdi profilleri oluşturun:
INSERT INTO profiles (id, email, full_name, role, created_at)
VALUES 
  -- Öğretmen
  ('4dca9d00-afc4-45d6-9d69-e9a95a87ee61', 'teacher@test.com', 'Ahmet Öğretmen', 'teacher', NOW()),
  -- Öğrenci 1
  ('c498f979-49b5-4352-9462-7bcb7bd4be93', 'student1@test.com', 'Ayşe Öğrenci', 'student', NOW()),
  -- Öğrenci 2
  ('9dc69601-75bb-403a-ad7a-d2663679c5a5', 'student2@test.com', 'Mehmet Öğrenci', 'student', NOW())
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- =====================================================
-- OLUŞTURULAN TEST KULLANICILARI:
-- =====================================================
--
-- | Email               | Şifre     | Rol      | Ad              |
-- |---------------------|-----------|----------|-----------------|
-- | teacher@test.com    | Test123!  | teacher  | Ahmet Öğretmen  |
-- | student1@test.com   | Test123!  | student  | Ayşe Öğrenci    |
-- | student2@test.com   | Test123!  | student  | Mehmet Öğrenci  |
--
-- =====================================================
