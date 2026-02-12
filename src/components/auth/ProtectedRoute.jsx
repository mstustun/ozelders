import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, profile, loading } = useAuth()
    const location = useLocation()

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

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (profile?.role === 'teacher') {
            return <Navigate to="/teacher" replace />
        } else {
            return <Navigate to="/student" replace />
        }
    }

    return children
}

export default ProtectedRoute
