import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

const Home = () => {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-white/60">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    // Redirect logged-in users to their dashboard
    if (user && profile) {
        if (profile.role === 'teacher') {
            window.location.href = '/teacher'
            return null
        } else {
            window.location.href = '/student'
            return null
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Configuration Warning */}
            {!isSupabaseConfigured && (
                <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-200 px-4 py-3 text-center text-sm">
                    <span className="font-semibold">⚠️ Supabase Yapılandırılmamış:</span> Lütfen <code className="bg-black/20 px-1 rounded">.env</code> dosyasındaki Supabase URL ve Anon Key'i güncelleyin.
                </div>
            )}

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="text-center max-w-2xl animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Özel Ders
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Platformu</span>
                    </h1>

                    <p className="text-lg text-white/60 mb-8 max-w-lg mx-auto">
                        Öğretmeninizle bağlantıda kalın, derslerinizi takip edin ve ödevlerinizi yönetin.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login" className="btn btn-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Giriş Yap
                        </Link>
                        <Link to="/register" className="btn btn-secondary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Kayıt Ol
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: 'Ders Takibi',
                                description: 'Tüm derslerinizi tek yerden takip edin'
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                ),
                                title: 'Ödev Yönetimi',
                                description: 'Ödevlerinizi kolayca görüntüleyin'
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                                    </svg>
                                ),
                                title: 'Öğretmen İletişimi',
                                description: 'Öğretmeninizle iletişimde kalın'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card text-center animate-fade-in"
                                style={{ animationDelay: `${(index + 3) * 100}ms` }}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400">
                                    {feature.icon}
                                </div>
                                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                                <p className="text-white/60 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-white/40 text-sm">
                <p>© 2026 Özel Ders Platformu</p>
            </footer>
        </div>
    )
}

export default Home
