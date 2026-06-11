import React, { createContext, useEffect, useState } from 'react'
import axios from "axios";
import {
  getProfileAPI,
  getUserAnalyticsAPI,
  googleAuthAPI,
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
    console.log("AuthProvider mounted, token:", token)
    if (!token) {
      setLoading(false)
      return
    }
    /* ---------------- FETCH PROFILE ---------------- */
    fetchProfile()
  }, [token])


  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(getProfileAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.log("Backend error:", errorData);
        throw new Error(errorData.message || "Invalid token");
      }

      const data = await res.json()
      console.log("user data fetched fetchProfile >>>", data)
      setUser(data?.user)
    } catch (err) {
      console.log("this is an fetchProfile error", err)
      console.log("Profile error:", err);

      if (err.message === "Invalid token") {
        clearSession(); // only then logout
      }
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- HELPERS ---------------- */
  const persistToken = (token, rememberMe) => {
    // rememberMe ? sessionStorage.setItem('token', token) :
    localStorage.setItem('token', token)
    setToken(token)
  }

  const clearSession = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    // setToken(null)
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
      console.log("payload:::", payload)
      const res = await fetch(updateProfileAPI, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      console.log("updateProfile>>>", data)
      setUser((prev) => ({ ...prev, ...data.user }))
      return { success: true, message: "profile updated successfully" }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const getUserAnalysisData = async (period = '30') => {
    try {
      const response = await fetch(`${getUserAnalyticsAPI}?period=${period}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch Analytic Data:", response.status)
      }

      const data = await response.json()
      console.log("getUserAnalysisData:::", data)
      return data
    } catch (error) {
      return { success: false, error: error.message }

    }
  }

  // Google Auth
  const googleAuth = async (code, rememberMe = true) => {
    try {
      setLoading(true);

      const res = await googleAuthAPI(code); // ✅ use API layer
      const { user, token } = res.data;

      setUser(user);
      persistToken(token, rememberMe); // ✅ centralised storage

      return { success: true };
    } catch (error) {
      console.error("Google Auth Error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile,
    getUserAnalysisData,
    googleAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }