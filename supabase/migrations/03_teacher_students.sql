-- =====================================================
-- ÖĞRETMEN-ÖĞRENCİ İLİŞKİ TABLOSU
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

CREATE TABLE IF NOT EXISTS teacher_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(teacher_id, student_id)
);

-- =====================================================
-- RLS POLİTİKALARI
-- =====================================================

ALTER TABLE teacher_students ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Öğretmen kendi öğrencilerini görebilir
CREATE POLICY "ts_select_teacher" ON teacher_students
    FOR SELECT
    USING (auth.uid() = teacher_id);

-- 2. SELECT: Öğrenci kendi öğretmen bağlantısını görebilir
CREATE POLICY "ts_select_student" ON teacher_students
    FOR SELECT
    USING (auth.uid() = student_id);

-- 3. INSERT: Sadece öğretmenler öğrenci ekleyebilir
CREATE POLICY "ts_insert_teacher" ON teacher_students
    FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- 4. DELETE: Sadece öğretmenler öğrenci çıkarabilir
CREATE POLICY "ts_delete_teacher" ON teacher_students
    FOR DELETE
    USING (auth.uid() = teacher_id);

-- =====================================================
-- İNDEKSLER
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_ts_teacher_id ON teacher_students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_ts_student_id ON teacher_students(student_id);

-- =====================================================
-- ÖĞRETMEN PROFİL POLİTİKASI GÜNCELLEMESİ
-- Öğretmenler, teacher_students tablosundaki öğrencilerin
-- profillerini görebilir (lessons'a ek olarak)
-- =====================================================
CREATE POLICY "profiles_select_teacher_linked_students" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM teacher_students
            WHERE teacher_students.teacher_id = auth.uid()
              AND teacher_students.student_id = profiles.id
        )
    );
