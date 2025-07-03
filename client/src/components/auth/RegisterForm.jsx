import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import { toast } from '../common/Toast'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    fitnessLevel: 'beginner'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await register(formData)
      if (result.success) {
        toast.success('Account created successfully!')
        navigate('/onboarding')
      } else {
        toast.error(result.error || 'Registration failed')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        name="name"
        type="text"
        required
        value={formData.name}
        onChange={handleChange}
        leftIcon={<User className="w-5 h-5" />}
        placeholder="Enter your full name"
      />

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
        label="Location"
        name="location"
        type="text"
        required
        value={formData.location}
        onChange={handleChange}
        leftIcon={<MapPin className="w-5 h-5" />}
        placeholder="City, State"
      />

      <Select
        label="Fitness Level"
        name="fitnessLevel"
        value={formData.fitnessLevel}
        onChange={handleChange}
        options={fitnessLevels}
        required
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

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        leftIcon={<Lock className="w-5 h-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        placeholder="Confirm your password"
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}