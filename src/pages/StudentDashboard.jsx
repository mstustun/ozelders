import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const StudentDashboard = () => {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const quickLinks = [
        {
            title: 'Ders Programım',
            description: 'Yaklaşan derslerinizi görüntüleyin',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'from-indigo-500 to-purple-600',
            available: false
        },
        {
            title: 'Ödevlerim',
            description: 'Bekleyen ödevlerinizi kontrol edin',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            color: 'from-cyan-500 to-blue-600',
            available: false
        },
        {
            title: 'Notlarım',
            description: 'Ders notlarınıza erişin',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            color: 'from-green-500 to-emerald-600',
            available: false
        },
    ]

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
                    <button onClick={handleSignOut} className="btn btn-secondary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                    </button>
                </header>

                {/* Welcome Card */}
                <div className="glass-card mb-8 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{profile?.full_name || 'Öğrenci'}</h2>
                            <p className="text-white/60">{profile?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <h2 className="text-xl font-bold text-white mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    Hızlı Erişim
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {quickLinks.map((link, index) => (
                        <div
                            key={index}
                            className={`glass-card cursor-pointer ${!link.available ? 'opacity-60' : ''} animate-fade-in`}
                            style={{ animationDelay: `${(index + 2) * 100}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white mb-4`}>
                                {link.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{link.title}</h3>
                            <p className="text-white/60 text-sm">{link.description}</p>
                            {!link.available && (
                                <span className="inline-block mt-3 text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
                                    Yakında
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Info Card */}
                <div className="glass-card animate-fade-in" style={{ animationDelay: '500ms' }}>
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
                                Yakında ders programı, ödev takibi ve daha fazla özellik eklenecek.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
