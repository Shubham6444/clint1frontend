"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Youtube, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default  function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState("email") // "email" or "whatsapp"

  const validateForm = () => {
    const newErrors = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = `${loginMethod === "email" ? "Email" : "WhatsApp number"} is required`
    } else if (loginMethod === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.emailOrPhone)) {
        newErrors.emailOrPhone = "Please enter a valid email address"
      }
    } else {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(formData.emailOrPhone.replace(/\s/g, ""))) {
        newErrors.emailOrPhone = "Please enter a valid WhatsApp number"
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Use the correct field name that matches the backend
      const loginData = {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
      }

      console.log("Attempting login with:", { emailOrPhone: loginData.emailOrPhone, password: "***" })

      await login(loginData)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-white">CreatorHub</span>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm">
                <Youtube className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-white/80">Sign in to your CreatorHub account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Login Method Toggle */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 ${
                  loginMethod === "email"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={loginMethod === "whatsapp" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginMethod("whatsapp")}
                className={`flex-1 ${
                  loginMethod === "whatsapp"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or WhatsApp Input */}
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone" className="text-white">
                  {loginMethod === "email" ? "Email Address" : "WhatsApp Number"}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loginMethod === "email" ? (
                      <Mail className="h-4 w-4 text-white/60" />
                    ) : (
                      <Phone className="h-4 w-4 text-white/60" />
                    )}
                  </div>
                  <Input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type={loginMethod === "email" ? "email" : "tel"}
                    placeholder={loginMethod === "email" ? "Enter your email" : "Enter your WhatsApp number"}
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-purple-400"
                  />
                </div>
                {errors.emailOrPhone && (
                  <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.emailOrPhone}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-white/60" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                {/* <Link
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot your password?
                </Link> */}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-2 text-white/60">
                  {/* Or continue with */}
                </span>
              </div>
            </div>

            {/* Social Login
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div> */}

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-white/80">Don't have an account? </span>
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

