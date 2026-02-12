import { useState } from 'react'
import LessonCard from './LessonCard'

const filters = [
    { key: 'all', label: 'Tümü' },
    { key: 'scheduled', label: 'Planlanmış' },
    { key: 'completed', label: 'Tamamlanmış' },
    { key: 'cancelled', label: 'İptal' },
]

const LessonList = ({ lessons, role, loading, onEdit, onStatusChange, onDelete }) => {
    const [activeFilter, setActiveFilter] = useState('all')

    const filteredLessons = activeFilter === 'all'
        ? lessons
        : lessons.filter(l => l.status === activeFilter)

    return (
        <div>
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {filters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeFilter === f.key
                                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                                : 'bg-white/5 text-white/60 border border-transparent hover:bg-white/10'
                            }`}
                    >
                        {f.label}
                        {f.key !== 'all' && (
                            <span className="ml-1.5 text-xs opacity-60">
                                ({lessons.filter(l => l.status === f.key).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Lesson list */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-white/60">Dersler yükleniyor...</p>
                </div>
            ) : filteredLessons.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-white/60">
                        {activeFilter === 'all' ? 'Henüz ders eklenmemiş' : `${filters.find(f => f.key === activeFilter)?.label} ders bulunamadı`}
                    </p>
                    {role === 'teacher' && activeFilter === 'all' && (
                        <p className="text-white/40 text-sm mt-2">
                            &quot;Yeni Ders Ekle&quot; butonunu kullanarak ilk dersinizi oluşturun
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredLessons.map((lesson, index) => (
                        <div key={lesson.id} style={{ animationDelay: `${index * 50}ms` }}>
                            <LessonCard
                                lesson={lesson}
                                role={role}
                                onEdit={onEdit}
                                onStatusChange={onStatusChange}
                                onDelete={onDelete}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LessonList
