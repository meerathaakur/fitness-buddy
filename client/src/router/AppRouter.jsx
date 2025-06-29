import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import OnboardingLayout from '../layouts/OnboardingLayout'

// Pages
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import Profile from '../pages/profile/Profile'
import EditProfile from '../pages/profile/EditProfile'
import Settings from '../pages/profile/Settings'
import Workouts from '../pages/workouts/Workouts'
import WorkoutDetail from '../pages/workouts/WorkoutDetail'
import WorkoutLibrary from '../pages/workouts/WorkoutLibrary'
import BuddyFinder from '../pages/buddies/BuddyFinder'
import MyBuddies from '../pages/buddies/MyBuddies'
import Messages from '../pages/messages/Messages'
import Goals from '../pages/goals/Goals'
import Challenges from '../pages/challenges/Challenges'
import ChallengeDetail from '../pages/challenges/ChallengeDetail'
import ChallengeLeaderboard from '../pages/challenges/ChallengeLeaderboard'
import Notifications from '../pages/notifications/Notifications'
import Onboarding from '../pages/Onboarding'
import NotFound from '../pages/NotFound'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
    }

    return user ? children : <Navigate to="/auth/login" />
}

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
    }

    return !user ? children : <Navigate to="/dashboard" />
}

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            {/* Onboarding */}
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingLayout /></ProtectedRoute>}>
                <Route index element={<Onboarding />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="workouts" element={<Workouts />} />
                <Route path="workouts/:id" element={<WorkoutDetail />} />
                <Route path="workout-library" element={<WorkoutLibrary />} />
                <Route path="buddies" element={<BuddyFinder />} />
                <Route path="my-buddies" element={<MyBuddies />} />
                <Route path="messages" element={<Messages />} />
                <Route path="goals" element={<Goals />} />
                <Route path="challenges" element={<Challenges />} />
                <Route path="challenges/:id" element={<ChallengeDetail />} />
                <Route path="challenges/:id/leaderboard" element={<ChallengeLeaderboard />} />
                <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}