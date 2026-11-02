import React from 'react'
import { Outlet } from 'react-router-dom'
import bgImage from '../assets/image18.jpg'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4
    bg-center 
    bg-cover 
    bg-no-repeat"
    style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-100 mb-2 text-cyan-100">FitnessBuddy</h1>
          <p className="text-gray-200">Find your perfect workout partner</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}