import React, { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock user data
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'New York, NY',
    fitnessLevel: 'intermediate',
    workoutPreferences: ['strength', 'cardio'],
    fitnessGoals: ['weight_loss', 'muscle_gain'],
    joinedDate: '2024-01-15',
    bio: 'Fitness enthusiast looking for workout partners!'
  }

  useEffect(() => {
    // Simulate checking for existing session
    const token = localStorage.getItem('token')
    if (token) {
      setUser(mockUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Mock login
      localStorage.setItem('token', 'mock-token')
      setUser(mockUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // Mock registration
      const newUser = { ...mockUser, ...userData, id: Date.now().toString() }
      localStorage.setItem('token', 'mock-token')
      setUser(newUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }