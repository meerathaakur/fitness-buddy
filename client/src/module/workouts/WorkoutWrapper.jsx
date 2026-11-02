import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { WorkoutProvider } from './WorkoutContext'
import { useWorkout } from './useWorkout'
import { useAuth } from '../auth/useAuth'

// Inner component so it can call useWorkout() — which needs to be
// *inside* WorkoutProvider to work
function WorkoutLoader() {
    const { token } = useAuth()
    const { loadInitialData, initialized, loading } = useWorkout()

    useEffect(() => {
        if (token && !initialized) {
            loadInitialData()
        }
    }, [token, initialized, loadInitialData])

    if (token && loading && !initialized) {
        return <div className="flex items-center justify-center h-64">Loading your workouts...</div>
    }

    return <Outlet />
}

export default function WorkoutWrapper() {
    return (
        <WorkoutProvider>
            <WorkoutLoader />
        </WorkoutProvider>
    )
}