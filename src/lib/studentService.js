import { supabase } from './supabase'

/**
 * Öğretmenin öğrenci listesini getir (teacher_students tablosundan)
 */
export const getMyStudents = async (teacherId) => {
    const { data, error } = await supabase
        .from('teacher_students')
        .select(`
            id,
            added_at,
            student:profiles!teacher_students_student_id_fkey(id, full_name, email)
        `)
        .eq('teacher_id', teacherId)
        .order('added_at', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Email ile öğrenci ara
 */
export const searchStudentByEmail = async (email) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('email', email.trim().toLowerCase())
        .eq('role', 'student')
        .single()

    if (error && error.code === 'PGRST116') {
        return null // Not found
    }
    if (error) throw error
    return data
}

/**
 * Öğrenciyi öğretmene bağla
 */
export const addStudentToTeacher = async (teacherId, studentId) => {
    const { data, error } = await supabase
        .from('teacher_students')
        .insert([{ teacher_id: teacherId, student_id: studentId }])
        .select(`
            id,
            added_at,
            student:profiles!teacher_students_student_id_fkey(id, full_name, email)
        `)
        .single()

    if (error) {
        if (error.code === '23505') {
            throw new Error('Bu öğrenci zaten listenizde')
        }
        throw error
    }
    return data
}

/**
 * Öğrenciyi öğretmenden çıkar
 */
export const removeStudentFromTeacher = async (relationId) => {
    const { error } = await supabase
        .from('teacher_students')
        .delete()
        .eq('id', relationId)

    if (error) throw error
}
