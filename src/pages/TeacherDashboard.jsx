import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { getLessons, createLesson, updateLesson, updateLessonStatus, deleteLesson } from '../lib/lessonService'
import { getMyStudents, removeStudentFromTeacher } from '../lib/studentService'
import LessonList from '../components/lessons/LessonList'
import LessonForm from '../components/lessons/LessonForm'
import AddStudentModal from '../components/students/AddStudentModal'

const TeacherDashboard = () => {
    const { user, profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [lessons, setLessons] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showAddStudent, setShowAddStudent] = useState(false)
    const [editingLesson, setEditingLesson] = useState(null)
    const [error, setError] = useState('')

    const fetchData = useCallback(async () => {
        if (!user) return
        try {
            const [lessonsData, studentsData] = await Promise.all([
                getLessons(user.id, 'teacher'),
                getMyStudents(user.id),
            ])
            setLessons(lessonsData)
            setStudents(studentsData)
        } catch (err) {
            console.error('Error fetching data:', err)
            setError('Veriler yüklenirken hata oluştu')
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const handleCreateLesson = async (data) => {
        try {
            const newLesson = await createLesson(data)
            setLessons(prev => [...prev, newLesson].sort((a, b) =>
                a.lesson_date.localeCompare(b.lesson_date) || a.start_time.localeCompare(b.start_time)
            ))
            setShowForm(false)
        } catch (err) {
            console.error('Error creating lesson:', err)
            setError('Ders oluşturulurken hata oluştu')
        }
    }

    const handleEditLesson = (lesson) => {
        setEditingLesson(lesson)
        setShowForm(true)
    }

    const handleUpdateLesson = async (data) => {
        const updated = await updateLesson(editingLesson.id, data)
        setLessons(prev => prev.map(l => l.id === updated.id ? updated : l))
        setShowForm(false)
        setEditingLesson(null)
    }

    const handleStatusChange = async (id, status) => {
        try {
            const updated = await updateLessonStatus(id, status)
            setLessons(prev => prev.map(l => l.id === updated.id ? updated : l))
        } catch (err) {
            console.error('Error updating status:', err)
        }
    }

    const handleDeleteLesson = async (id) => {
        if (!window.confirm('Bu dersi silmek istediğinize emin misiniz?')) return
        try {
            await deleteLesson(id)
            setLessons(prev => prev.filter(l => l.id !== id))
        } catch (err) {
            console.error('Error deleting lesson:', err)
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingLesson(null)
    }

    const handleStudentAdded = (newRelation) => {
        setStudents(prev => [newRelation, ...prev])
    }

    const handleRemoveStudent = async (relationId) => {
        if (!window.confirm('Bu öğrenciyi listenizden çıkarmak istediğinize emin misiniz?')) return
        try {
            await removeStudentFromTeacher(relationId)
            setStudents(prev => prev.filter(s => s.id !== relationId))
        } catch (err) {
            console.error('Error removing student:', err)
        }
    }

    const scheduledCount = lessons.filter(l => l.status === 'scheduled').length
    const completedCount = lessons.filter(l => l.status === 'completed').length

    const stats = [
        {
            label: 'Toplam Öğrenci',
            value: students.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m12 5.197v-1a6 6 0 00-3-5.197" />
                </svg>
            ),
            color: 'from-indigo-500 to-purple-600'
        },
        {
            label: 'Planlanan Dersler',
            value: scheduledCount,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'from-cyan-500 to-blue-600'
        },
        {
            label: 'Tamamlanan Dersler',
            value: completedCount,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-green-500 to-emerald-600'
        },
    ]

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="animate-fade-in">
                        <p className="text-white/60 text-sm mb-1">Hoş geldiniz,</p>
                        <h1 className="text-3xl font-bold text-white">
                            {profile?.full_name || 'Öğretmen'}
                        </h1>
                        <span className="badge badge-teacher mt-2">Öğretmen</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setEditingLesson(null); setShowForm(true) }}
                            className="btn btn-primary"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Yeni Ders Ekle
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="glass-card animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lessons */}
                <div className="glass-card animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Ders Programı</h2>
                        <span className="text-white/60 text-sm">{lessons.length} ders</span>
                    </div>

                    <LessonList
                        lessons={lessons}
                        role="teacher"
                        loading={loading}
                        onEdit={handleEditLesson}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteLesson}
                    />
                </div>

                {/* Students List */}
                <div className="glass-card animate-fade-in mt-8" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Öğrencilerim</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-white/60 text-sm">{students.length} öğrenci</span>
                            <button
                                onClick={() => setShowAddStudent(true)}
                                className="btn btn-primary text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Öğrenci Ekle
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="text-white/60">Yükleniyor...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <p className="text-white/60">Henüz öğrenci eklenmemiş</p>
                            <p className="text-white/40 text-sm mt-2">
                                &quot;Öğrenci Ekle&quot; butonunu kullanarak öğrencilerinizi ekleyin
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {students.map((relation, index) => (
                                <div
                                    key={relation.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors animate-slide-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                            {relation.student?.full_name?.charAt(0) || relation.student?.email?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{relation.student?.full_name || 'İsimsiz'}</p>
                                            <p className="text-white/60 text-sm">{relation.student?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-student">Öğrenci</span>
                                        <button
                                            onClick={() => handleRemoveStudent(relation.id)}
                                            className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                                            title="Öğrenciyi Çıkar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Lesson Form Modal */}
            {showForm && (
                <LessonForm
                    teacherId={user?.id}
                    initialData={editingLesson}
                    onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}
                    onCancel={handleCloseForm}
                />
            )}

            {/* Add Student Modal */}
            {showAddStudent && (
                <AddStudentModal
                    teacherId={user?.id}
                    onStudentAdded={handleStudentAdded}
                    onCancel={() => setShowAddStudent(false)}
                />
            )}
        </div>
    )
}

export default TeacherDashboard
