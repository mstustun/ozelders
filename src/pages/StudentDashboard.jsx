import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { getLessons, getUpcomingLessons } from '../lib/lessonService'
import LessonList from '../components/lessons/LessonList'

const StudentDashboard = () => {
    const { user, profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [lessons, setLessons] = useState([])
    const [upcomingLessons, setUpcomingLessons] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        if (!user) return
        try {
            const [allLessons, upcoming] = await Promise.all([
                getLessons(user.id, 'student'),
                getUpcomingLessons(user.id, 'student'),
            ])
            setLessons(allLessons)
            setUpcomingLessons(upcoming)
        } catch (err) {
            console.error('Error fetching lessons:', err)
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

    const scheduledCount = lessons.filter(l => l.status === 'scheduled').length
    const completedCount = lessons.filter(l => l.status === 'completed').length
    const nextLesson = upcomingLessons[0]

    const formatDate = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        })
    }

    const formatTime = (timeStr) => timeStr?.slice(0, 5) || ''

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="animate-fade-in">
                        <p className="text-white/60 text-sm mb-1">Hoş geldiniz,</p>
                        <h1 className="text-3xl font-bold text-white">
                            {profile?.full_name || 'Öğrenci'}
                        </h1>
                        <span className="badge badge-student mt-2">Öğrenci</span>
                    </div>
                </header>

                {/* Next Lesson Card */}
                {nextLesson && (
                    <div className="glass-card mb-8 animate-fade-in border-indigo-500/30">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-white/60 text-sm mb-1">Sıradaki Ders</p>
                                <h2 className="text-xl font-bold text-white mb-1">{nextLesson.subject}</h2>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                                    <span>{formatDate(nextLesson.lesson_date)}</span>
                                    <span>{formatTime(nextLesson.start_time)} - {formatTime(nextLesson.end_time)}</span>
                                    <span>Öğretmen: {nextLesson.teacher?.full_name || 'Bilinmiyor'}</span>
                                </div>
                                {nextLesson.meeting_link && (
                                    <a
                                        href={nextLesson.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary mt-3 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Derse Katıl
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        {
                            label: 'Toplam Ders',
                            value: lessons.length,
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            ),
                            color: 'from-indigo-500 to-purple-600',
                        },
                        {
                            label: 'Planlanan',
                            value: scheduledCount,
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            ),
                            color: 'from-cyan-500 to-blue-600',
                        },
                        {
                            label: 'Tamamlanan',
                            value: completedCount,
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                            color: 'from-green-500 to-emerald-600',
                        },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="glass-card animate-fade-in"
                            style={{ animationDelay: `${(index + 1) * 100}ms` }}
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
                <div className="glass-card animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Derslerim</h2>
                        <span className="text-white/60 text-sm">{lessons.length} ders</span>
                    </div>

                    <LessonList
                        lessons={lessons}
                        role="student"
                        loading={loading}
                    />
                </div>

                {/* Info Card */}
                <div className="glass-card animate-fade-in mt-8" style={{ animationDelay: '500ms' }}>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">Platformumuza Hoş Geldiniz!</h3>
                            <p className="text-white/60 text-sm">
                                Bu platform öğretmeniniz tarafından sizin için hazırlandı.
                                Ders programınızı ve toplantı linklerinizi buradan takip edebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
