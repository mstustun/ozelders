import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const Navbar = () => {
    const { user, profile, signOut } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    const linkClass = (path) =>
        `nav-link ${isActive(path) ? 'nav-link-active' : ''}`

    return (
        <nav className="navbar">
            <div className="container mx-auto flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-white font-bold text-lg hidden sm:block">Özel Ders</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    <Link to="/" className={linkClass('/')}>
                        Ana Sayfa
                    </Link>

                    {user && profile ? (
                        <>
                            {profile.role === 'teacher' ? (
                                <Link to="/teacher" className={linkClass('/teacher')}>
                                    Öğretmen Paneli
                                </Link>
                            ) : (
                                <Link to="/student" className={linkClass('/student')}>
                                    Öğrenci Paneli
                                </Link>
                            )}
                            <div className="w-px h-6 bg-white/10 mx-2"></div>
                            <div className="flex items-center gap-3">
                                <span className={`badge ${profile.role === 'teacher' ? 'badge-teacher' : 'badge-student'}`}>
                                    {profile.full_name || profile.email}
                                </span>
                                <button onClick={handleSignOut} className="nav-link text-red-300 hover:text-red-200 hover:bg-red-500/10">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Çıkış
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={linkClass('/login')}>
                                Giriş Yap
                            </Link>
                            <Link to="/register" className="btn btn-primary text-sm !py-2 !px-4">
                                Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                >
                    {mobileOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1 animate-fade-in">
                    <Link to="/" className={linkClass('/')} onClick={() => setMobileOpen(false)}>
                        Ana Sayfa
                    </Link>

                    {user && profile ? (
                        <>
                            {profile.role === 'teacher' ? (
                                <Link to="/teacher" className={linkClass('/teacher')} onClick={() => setMobileOpen(false)}>
                                    Öğretmen Paneli
                                </Link>
                            ) : (
                                <Link to="/student" className={linkClass('/student')} onClick={() => setMobileOpen(false)}>
                                    Öğrenci Paneli
                                </Link>
                            )}
                            <div className="border-t border-white/10 my-1"></div>
                            <div className="flex items-center justify-between px-3 py-2">
                                <span className={`badge ${profile.role === 'teacher' ? 'badge-teacher' : 'badge-student'}`}>
                                    {profile.full_name || profile.email}
                                </span>
                                <button onClick={handleSignOut} className="nav-link text-red-300 hover:text-red-200 hover:bg-red-500/10">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Çıkış
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={linkClass('/login')} onClick={() => setMobileOpen(false)}>
                                Giriş Yap
                            </Link>
                            <Link to="/register" className={linkClass('/register')} onClick={() => setMobileOpen(false)}>
                                Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar
