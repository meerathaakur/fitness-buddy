import React from 'react'
import LoginForm from './LoginForm'
import SocialAuth from './SocialAuth'
import Card from "../../common/Card"


export default function Login() {
  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <LoginForm />
      
      <div className="mt-6">
        <SocialAuth mode="login" />
      </div>
    </Card>
  )
}