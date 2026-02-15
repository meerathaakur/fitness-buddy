import React, { createContext, useEffect, useState } from 'react'
import {
  getProfileAPI,
  getUserAnalyticsAPI,
  loginAPI,
  registerAPI,
  updateProfileAPI,
  // verifyEmailAPI,
  // verifyEmailAPI,
  // forgotPasswordAPI,
  // resetPasswordAPI,
  // updatePreferencesAPI,
  // updateLocationAPI
} from '../../api/all.api.js'

const AuthContext = createContext(null)

const getStoredToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token')

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getStoredToken())
  const [loading, setLoading] = useState(true)  

  /* ---------------- INIT AUTH ---------------- */

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    /* ---------------- FETCH PROFILE ---------------- */

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch(getProfileAPI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Invalid token')

        const data = await res.json()
        // console.log("user data fetched fetchProfile >>>", data)
        setUser(data?.user)
      } catch (err) {
        console.log(err)
        clearSession()
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [token])

  /* ---------------- HELPERS ---------------- */
  const persistToken = (token, remember) => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')

    remember
      ? localStorage.setItem('token', token)
      : sessionStorage.setItem('token', token)

    setToken(token)
  }

  const clearSession = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  /* ---------------- ACTIONS ---------------- */
  const login = async (email, password, rememberMe) => {
    try {
      setLoading(true)
      const res = await fetch(loginAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      console.log("login data", data)
      setUser(data?.user)
      persistToken(data.token, rememberMe)
      return data
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload, rememberMe = true) => {
    try {
      setLoading(true)
      const res = await fetch(registerAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      persistToken(data.token, rememberMe)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearSession()
  }

  const updateProfile = async (payload) => {
    try {
      console.log("payload:::",payload)
      const res = await fetch(updateProfileAPI, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload, 
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      console.log("updateProfile>>>",data)
      setUser((prev) => ({ ...prev, ...data.user }))
      return { success: true, message:"profile updated sucessfully" }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const getUserAnalysisData=async()=>{
    try {
      const response=await fetch(getUserAnalyticsAPI,{
        method:"GET",
        headers:{
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        }
      })
      if(!response.ok){
        throw new Error("Failed to fetch Analytic Data:", response.status)
      }

      const data=await response.json()
      console.log("getUserAnalysisData:::",data)
      return data
    } catch (error) {
      return { success: false, error: error.message }
      
    }
  }

  const value={
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateProfile,
        getUserAnalysisData,
      }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }