import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { user } = await signIn(email, password)
            if (user) {
                navigate('/')
            }
        } catch (err) {
            setError(err.message === 'Invalid login credentials'
                ? 'Geçersiz email veya şifre'
                : 'Giriş yapılırken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="glass-card">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz</h1>
                        <p className="text-white/60">Hesabınıza giriş yapın</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="input"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">Şifre</label>
                            <input
                                type="password"
                                id="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Giriş Yapılıyor...
                                </>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-white/60 mt-6">
                        Hesabınız yok mu?{' '}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            Kayıt Olun
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
