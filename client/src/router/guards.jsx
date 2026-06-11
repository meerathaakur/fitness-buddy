import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../module/auth/useAuth'

export const RequireAuth = () => {
    const { isAuthenticated, loading } = useAuth()
    // console.log("RequireAuth isAuthenticated >>>",isAuthenticated)

    if (loading) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />
}

export const RequireGuest = () => {
    const { isAuthenticated, loading } = useAuth()
    // console.log("RequireGuest isAuthenticated >>>",isAuthenticated)

    if (loading) {
        return <div>Loading...</div>
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />
}
