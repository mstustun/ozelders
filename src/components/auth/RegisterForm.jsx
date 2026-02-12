import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const RegisterForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor')
            return
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır')
            return
        }

        setLoading(true)

        try {
            await signUp(email, password, fullName, 'student')
            setSuccess(true)
        } catch (err) {
            if (err.message.includes('already registered')) {
                setError('Bu email adresi zaten kayıtlı')
            } else {
                setError('Kayıt olurken bir hata oluştu')
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="glass-card text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Kayıt Başarılı!</h2>
                        <p className="text-white/60 mb-6">
                            Hesabınızı doğrulamak için email adresinizi kontrol edin.
                        </p>
                        <Link to="/login" className="btn btn-primary">
                            Giriş Sayfasına Git
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="glass-card">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Hesap Oluştur</h1>
                        <p className="text-white/60">Öğrenci olarak kayıt olun</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="fullName">Ad Soyad</label>
                            <input
                                type="text"
                                id="fullName"
                                className="input"
                                placeholder="Adınız Soyadınız"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

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
                                placeholder="En az 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="confirmPassword">Şifre Tekrar</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="input"
                                placeholder="Şifrenizi tekrar girin"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    Kayıt Yapılıyor...
                                </>
                            ) : (
                                'Kayıt Ol'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-white/60 mt-6">
                        Zaten hesabınız var mı?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            Giriş Yapın
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
