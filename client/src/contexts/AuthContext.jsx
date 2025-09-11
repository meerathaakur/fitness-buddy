import React, { createContext, useState, useEffect } from 'react'

import {
  getProfileAPI,
  loginAPI,
  registerAPI,
  updateProfileAPI,
  // verifyEmailAPI,
  // verifyEmailAPI,
  // forgotPasswordAPI,
  // resetPasswordAPI,
  // updatePreferencesAPI,
  // updateLocationAPI
} from "../api/all.api.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    // Simulate checking for existing session
    const token = localStorage.getItem('token')
    const session=sessionStorage.getItem("token")
    if (token || session) {
      async function getUserProfile() {
        try {
          setLoading(true)
          const response = await fetch(getProfileAPI, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.status}`)
          }

          const data = await response.json()
          setUser(data)
          setLoading(false)
          
          // console.log(data)
        } catch (error) {
          console.error("Profile fetch error", error)
          sessionStorage.removeItem("token")
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
      getUserProfile()
    } 
    setLoading(false)
  },[])

  const login = async (email, password, rememberMe = false) => {
    try {
      // setLoading(true)
      const response = await fetch(loginAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      localStorage.setItem('token', data.token)

      // setLoading(false)
      if (rememberMe) {
        localStorage.setItem('token', data.token)
      } else {
        sessionStorage.setItem("token", data.token)
      }
      return { message: data.message, success: response.ok }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // setLoading(true)
      const response = await fetch(registerAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData )
      })
      const data = await response.json()
      // setLoading(false)
      // const newUser = { ...data.user, ...userData }
      localStorage.setItem('token', data.token)
      // setUser(newUser)
      return { success: response.ok, message: data.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = async (userData) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(updateProfileAPI, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error("Failed to update profile:", response.status)
      }

      const data = await response.json()
      setUser((prev) => ({ ...prev, ...data.user }))
      return { success: response.ok, message: data.message }
    } catch (error) {
      return { success: false, error: error.message }
    }

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