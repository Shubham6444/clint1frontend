"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "@/lib/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const userData = await api.getCurrentUser()
        // Only set user if it's not a guest user
        if (userData && userData.id) {
          setUser(userData)
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      ////console.log("Auth hook login called with:", credentials)
      const response = await api.login(credentials)
      ////console.log("Login response:", response)
      localStorage.setItem("token", response.token)
      setUser(response.user)
      return response
    } catch (error) {
      console.error("Auth hook login error:", error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.register(userData)
      localStorage.setItem("token", response.token)
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
