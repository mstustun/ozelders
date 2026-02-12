-- =====================================================
-- DERS PROGRAMI TABLOSU
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  lesson_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- RLS POLİTİKALARI
-- =====================================================

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Öğretmen kendi derslerini görebilir
CREATE POLICY "lessons_select_teacher" ON lessons
    FOR SELECT
    USING (auth.uid() = teacher_id);

-- 2. SELECT: Öğrenci kendi derslerini görebilir
CREATE POLICY "lessons_select_student" ON lessons
    FOR SELECT
    USING (auth.uid() = student_id);

-- 3. INSERT: Sadece öğretmenler ders ekleyebilir (kendi ID'leri ile)
CREATE POLICY "lessons_insert_teacher" ON lessons
    FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- 4. UPDATE: Sadece öğretmenler kendi derslerini güncelleyebilir
CREATE POLICY "lessons_update_teacher" ON lessons
    FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- 5. DELETE: Sadece öğretmenler kendi derslerini silebilir
CREATE POLICY "lessons_delete_teacher" ON lessons
    FOR DELETE
    USING (auth.uid() = teacher_id);

-- =====================================================
-- İNDEKSLER (Performans)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_student_id ON lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_date ON lessons(lesson_date);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);

-- =====================================================
-- ÖĞRETMEN-ÖĞRENCİ PROFİL POLİTİKASI
-- (lessons tablosu oluşturulduktan sonra eklenebilir)
-- =====================================================
CREATE POLICY "profiles_select_teacher_students" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM lessons
            WHERE lessons.teacher_id = auth.uid()
              AND lessons.student_id = profiles.id
        )
    );
