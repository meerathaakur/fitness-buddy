import React from 'react'
import { Outlet } from 'react-router-dom'

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Outlet />
    </div>
  )
}