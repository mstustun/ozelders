import { supabase } from './supabase'

/**
 * Ders listesini getir
 * @param {string} userId - Kullanıcı ID
 * @param {string} role - 'teacher' veya 'student'
 * @param {string} [statusFilter] - İsteğe bağlı durum filtresi
 */
export const getLessons = async (userId, role, statusFilter = null) => {
    let query = supabase
        .from('lessons')
        .select(`
            *,
            teacher:profiles!lessons_teacher_id_fkey(id, full_name, email),
            student:profiles!lessons_student_id_fkey(id, full_name, email)
        `)

    if (role === 'teacher') {
        query = query.eq('teacher_id', userId)
    } else {
        query = query.eq('student_id', userId)
    }

    if (statusFilter) {
        query = query.eq('status', statusFilter)
    }

    query = query.order('lesson_date', { ascending: true })
        .order('start_time', { ascending: true })

    const { data, error } = await query

    if (error) throw error
    return data || []
}

/**
 * Yaklaşan dersleri getir (bugün ve sonrası, scheduled)
 */
export const getUpcomingLessons = async (userId, role) => {
    const today = new Date().toISOString().split('T')[0]

    let query = supabase
        .from('lessons')
        .select(`
            *,
            teacher:profiles!lessons_teacher_id_fkey(id, full_name, email),
            student:profiles!lessons_student_id_fkey(id, full_name, email)
        `)
        .eq('status', 'scheduled')
        .gte('lesson_date', today)

    if (role === 'teacher') {
        query = query.eq('teacher_id', userId)
    } else {
        query = query.eq('student_id', userId)
    }

    query = query.order('lesson_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(10)

    const { data, error } = await query

    if (error) throw error
    return data || []
}

/**
 * Yeni ders oluştur
 */
export const createLesson = async (lessonData) => {
    const { data, error } = await supabase
        .from('lessons')
        .insert([lessonData])
        .select(`
            *,
            teacher:profiles!lessons_teacher_id_fkey(id, full_name, email),
            student:profiles!lessons_student_id_fkey(id, full_name, email)
        `)
        .single()

    if (error) throw error
    return data
}

/**
 * Ders güncelle
 */
export const updateLesson = async (id, updates) => {
    const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select(`
            *,
            teacher:profiles!lessons_teacher_id_fkey(id, full_name, email),
            student:profiles!lessons_student_id_fkey(id, full_name, email)
        `)
        .single()

    if (error) throw error
    return data
}

/**
 * Ders durumunu güncelle
 */
export const updateLessonStatus = async (id, status) => {
    return updateLesson(id, { status })
}

/**
 * Ders sil
 */
export const deleteLesson = async (id) => {
    const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id)

    if (error) throw error
}

/**
 * Öğretmenin öğrenci listesini getir
 */
export const getStudentsList = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'student')
        .order('full_name', { ascending: true })

    if (error) throw error
    return data || []
}
