import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import OnboardingLayout from '../layouts/OnboardingLayout'

// // Pages
import Home from '../pages/Home'
import Login from '../module/auth/Login'
import Register from '../module/auth/Register'
import AuthCallback from '../module/auth/AuthCallback'
import Dashboard from '../module/dashboard/Dashboard'
import Profile from '../module/profile/Profile'
import EditProfile from '../module/profile/EditProfile'
import Settings from '../module/profile/Settings'
import Workouts from '../module/workouts/Workouts'
import WorkoutDetail from '../module/workouts/WorkoutDetail'
import WorkoutLibrary from '../module/workouts/WorkoutLibrary'
import BuddyFinder from '../module/buddies/BuddyFinder'
import MyBuddies from '../module/buddies/MyBuddies'
import Messages from '../module/messages/Messages'
import Goals from '../module/goals/Goals'
import Challenges from '../module/challenges/Challenges'
import ChallengeDetail from '../module/challenges/ChallengeDetail'
import ChallengeLeaderboard from '../module/challenges/ChallengeLeaderboard'
import Notifications from '../module/notifications/Notifications'
import Onboarding from '../pages/Onboarding'
import NotFound from '../pages/NotFound'
import { RequireAuth, RequireGuest } from './guards'
import { BuddyRoutes } from '../module/buddies/BuddyRoutes'
import { GoogleOAuthProvider } from '@react-oauth/google'


export default function AppRouter() {

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
                        {/* <Route path="/workouts/:id" element={<WorkoutDetail />} /> */}
                        {/* <Route path="/workout-library" element={<WorkoutLibrary />} /> */}
                        {/* <Route path="/buddies" element={<BuddyFinder />} /> */}
                        {/* <Route path="/my-buddies" element={<MyBuddies />} /> */}
                        {BuddyRoutes}
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
        </GoogleOAuthProvider>
    )
}
