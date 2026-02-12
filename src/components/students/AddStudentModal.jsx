import { useState } from 'react'
import { searchStudentByEmail, addStudentToTeacher } from '../../lib/studentService'

const AddStudentModal = ({ teacherId, onStudentAdded, onCancel }) => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searchResult, setSearchResult] = useState(null)
    const [searched, setSearched] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        setError('')
        setSearchResult(null)
        setSearched(false)
        setSuccess(false)

        if (!email.trim()) {
            setError('Email adresi girin')
            return
        }

        setLoading(true)
        try {
            const result = await searchStudentByEmail(email)
            setSearchResult(result)
            setSearched(true)
            if (!result) {
                setError('Bu email adresine sahip öğrenci bulunamadı')
            }
        } catch (err) {
            setError(err.message || 'Arama sırasında hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!searchResult) return
        setLoading(true)
        setError('')
        try {
            const added = await addStudentToTeacher(teacherId, searchResult.id)
            setSuccess(true)
            setSearchResult(null)
            setEmail('')
            if (onStudentAdded) {
                onStudentAdded(added)
            }
        } catch (err) {
            setError(err.message || 'Öğrenci eklenirken hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onCancel}>
            <div className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Öğrenci Ekle</h2>
                    <button
                        onClick={onCancel}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-white/60 text-sm mb-4">
                    Öğrencinizin kayıtlı email adresini girerek arayın ve listenize ekleyin.
                </p>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm">
                        ✅ Öğrenci başarıyla eklendi!
                    </div>
                )}

                <form onSubmit={handleSearch}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="student-email">Öğrenci Email</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                id="student-email"
                                className="input flex-1"
                                placeholder="ogrenci@email.com"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setSearched(false); setSuccess(false) }}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary flex-shrink-0"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="spinner" style={{ width: 18, height: 18 }}></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Search result */}
                {searched && searchResult && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-indigo-500/30 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                    {searchResult.full_name?.charAt(0) || searchResult.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{searchResult.full_name || 'İsimsiz'}</p>
                                    <p className="text-white/60 text-sm">{searchResult.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="btn btn-primary text-sm"
                            >
                                {loading ? (
                                    <div className="spinner" style={{ width: 16, height: 16 }}></div>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Ekle
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button onClick={onCancel} className="btn btn-secondary">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddStudentModal
