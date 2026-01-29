import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const RequireAuth = () => {
    const { isAuthenticated } = useAuth()
    // console.log("RequireAuth isAuthenticated >>>",isAuthenticated)

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />
}

export const RequireGuest = () => {
    const { isAuthenticated } = useAuth()
    // console.log("RequireGuest isAuthenticated >>>",isAuthenticated)

    return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />
}
