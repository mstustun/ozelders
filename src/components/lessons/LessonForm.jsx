import { useState, useEffect } from 'react'
import { getMyStudents } from '../../lib/studentService'

const LessonForm = ({ onSubmit, onCancel, initialData = null, teacherId }) => {
    const [formData, setFormData] = useState({
        subject: '',
        student_id: '',
        lesson_date: '',
        start_time: '',
        end_time: '',
        description: '',
        meeting_link: '',
        notes: '',
    })
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [loadingStudents, setLoadingStudents] = useState(true)

    useEffect(() => {
        if (initialData) {
            setFormData({
                subject: initialData.subject || '',
                student_id: initialData.student_id || '',
                lesson_date: initialData.lesson_date || '',
                start_time: initialData.start_time?.slice(0, 5) || '',
                end_time: initialData.end_time?.slice(0, 5) || '',
                description: initialData.description || '',
                meeting_link: initialData.meeting_link || '',
                notes: initialData.notes || '',
            })
        }
    }, [initialData])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getMyStudents(teacherId)
                // getMyStudents returns relations with nested student, flatten for dropdown
                setStudents(data.map(r => r.student).filter(Boolean))
            } catch (err) {
                console.error('Error fetching students:', err)
            } finally {
                setLoadingStudents(false)
            }
        }
        if (teacherId) fetchStudents()
    }, [teacherId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.subject.trim()) {
            setError('Konu alanı zorunludur')
            return
        }
        if (!formData.student_id) {
            setError('Öğrenci seçimi zorunludur')
            return
        }
        if (!formData.lesson_date) {
            setError('Tarih zorunludur')
            return
        }
        if (!formData.start_time || !formData.end_time) {
            setError('Başlangıç ve bitiş saati zorunludur')
            return
        }
        if (formData.start_time >= formData.end_time) {
            setError('Bitiş saati başlangıç saatinden sonra olmalıdır')
            return
        }

        setLoading(true)
        try {
            await onSubmit({
                ...formData,
                teacher_id: teacherId,
            })
        } catch (err) {
            setError(err.message || 'Bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onCancel}>
            <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="student_id">Öğrenci</label>
                        {loadingStudents ? (
                            <div className="input flex items-center gap-2 text-white/40">
                                <div className="spinner" style={{ width: 16, height: 16 }}></div>
                                Öğrenciler yükleniyor...
                            </div>
                        ) : (
                            <select
                                id="student_id"
                                name="student_id"
                                className="input"
                                value={formData.student_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Öğrenci seçin</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.full_name || s.email}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="subject">Konu</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="input"
                            placeholder="Ders konusu"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="input-group">
                            <label className="input-label" htmlFor="lesson_date">Tarih</label>
                            <input
                                type="date"
                                id="lesson_date"
                                name="lesson_date"
                                className="input"
                                value={formData.lesson_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label" htmlFor="start_time">Başlangıç</label>
                            <input
                                type="time"
                                id="start_time"
                                name="start_time"
                                className="input"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label" htmlFor="end_time">Bitiş</label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                className="input"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="description">Açıklama</label>
                        <textarea
                            id="description"
                            name="description"
                            className="input"
                            rows={2}
                            placeholder="Ders açıklaması (isteğe bağlı)"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="meeting_link">Toplantı Linki</label>
                        <input
                            type="url"
                            id="meeting_link"
                            name="meeting_link"
                            className="input"
                            placeholder="https://zoom.us/j/... (isteğe bağlı)"
                            value={formData.meeting_link}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="notes">Notlar</label>
                        <textarea
                            id="notes"
                            name="notes"
                            className="input"
                            rows={2}
                            placeholder="Öğretmen notları (isteğe bağlı)"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-secondary flex-1"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Kaydediliyor...
                                </>
                            ) : (
                                initialData ? 'Güncelle' : 'Ders Ekle'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LessonForm
