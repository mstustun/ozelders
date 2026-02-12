const statusConfig = {
    scheduled: {
        label: 'Planlandı',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-500/20',
        textColor: 'text-blue-300',
        borderColor: 'border-blue-500/30',
    },
    completed: {
        label: 'Tamamlandı',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-300',
        borderColor: 'border-green-500/30',
    },
    cancelled: {
        label: 'İptal Edildi',
        color: 'from-red-500 to-rose-600',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-300',
        borderColor: 'border-red-500/30',
    },
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('tr-TR', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
    })
}

const formatTime = (timeStr) => {
    return timeStr?.slice(0, 5) || ''
}

const LessonCard = ({ lesson, role, onEdit, onStatusChange, onDelete }) => {
    const config = statusConfig[lesson.status] || statusConfig.scheduled
    const personName = role === 'teacher'
        ? lesson.student?.full_name || 'Bilinmeyen Öğrenci'
        : lesson.teacher?.full_name || 'Bilinmeyen Öğretmen'
    const personLabel = role === 'teacher' ? 'Öğrenci' : 'Öğretmen'

    return (
        <div className={`p-4 rounded-xl bg-white/5 border ${config.borderColor} hover:bg-white/10 transition-all animate-slide-in`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold truncate">{lesson.subject}</h3>
                        <span className={`badge ${config.bgColor} ${config.textColor} text-xs`}>
                            {config.label}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(lesson.lesson_date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {personLabel}: {personName}
                        </span>
                    </div>

                    {lesson.description && (
                        <p className="text-white/40 text-sm mt-2 truncate">{lesson.description}</p>
                    )}
                </div>

                {/* Actions — teacher only */}
                {role === 'teacher' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {lesson.meeting_link && (
                            <a
                                href={lesson.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                                title="Toplantıya Katıl"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </a>
                        )}
                        {lesson.status === 'scheduled' && (
                            <button
                                onClick={() => onStatusChange(lesson.id, 'completed')}
                                className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Tamamlandı"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={() => onEdit(lesson)}
                            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                            title="Düzenle"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(lesson.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Sil"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Student — meeting link only */}
                {role === 'student' && lesson.meeting_link && lesson.status === 'scheduled' && (
                    <a
                        href={lesson.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Derse Katıl
                    </a>
                )}
            </div>
        </div>
    )
}

export default LessonCard
