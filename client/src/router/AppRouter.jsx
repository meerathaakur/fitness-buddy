import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import OnboardingLayout from '../layouts/OnboardingLayout'

// // Pages
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import AuthCallback from '../components/auth/AuthCallback'
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
import { RequireAuth, RequireGuest } from './guards'


export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Auth Routes (login/register) */}
            <Route element={<RequireGuest />}>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Route>

            {/* Protected Routes  */}
            <Route element={<RequireAuth />}>
                {/* components and pages */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/workouts" element={<Workouts />} />
                    <Route path="/workouts/:id" element={<WorkoutDetail />} />
                    <Route path="/workout-library" element={<WorkoutLibrary />} />
                    <Route path="/buddies" element={<BuddyFinder />} />
                    <Route path="/my-buddies" element={<MyBuddies />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/:id" element={<ChallengeDetail />} />
                    <Route path="/challenges/:id/leaderboard" element={<ChallengeLeaderboard />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Route>
                {/* Onboarding */}
                <Route path="/onboarding" element={<OnboardingLayout />}>
                    <Route index element={<Onboarding />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
