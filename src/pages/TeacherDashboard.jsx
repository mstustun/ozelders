import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TeacherDashboard = () => {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student')
                .order('created_at', { ascending: false })

            if (error) throw error
            setStudents(data || [])
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

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
            label: 'Aktif Öğrenciler',
            value: students.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-green-500 to-emerald-600'
        },
        {
            label: 'Bu Hafta Ders',
            value: '0',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'from-cyan-500 to-blue-600'
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
                    <button onClick={handleSignOut} className="btn btn-secondary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                    </button>
                </header>

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

                {/* Students List */}
                <div className="glass-card animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Öğrencilerim</h2>
                        <span className="text-white/60 text-sm">{students.length} öğrenci</span>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                                </svg>
                            </div>
                            <p className="text-white/60">Henüz kayıtlı öğrenci yok</p>
                            <p className="text-white/40 text-sm mt-2">Öğrencileriniz kayıt olduğunda burada görünecek</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {students.map((student, index) => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors animate-slide-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                            {student.full_name?.charAt(0) || student.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{student.full_name || 'İsimsiz'}</p>
                                            <p className="text-white/60 text-sm">{student.email}</p>
                                        </div>
                                    </div>
                                    <span className="badge badge-student">Öğrenci</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard
