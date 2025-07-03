import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'
import Input from '../common/Input'
import Checkbox from '../common/Checkbox'
import { toast } from '../common/Toast'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        leftIcon={<Mail className="w-5 h-5" />}
        placeholder="Enter your email"
      />

      <Input
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        value={formData.password}
        onChange={handleChange}
        leftIcon={<Lock className="w-5 h-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between">
        <Checkbox
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          label="Remember me"
        />
        <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}