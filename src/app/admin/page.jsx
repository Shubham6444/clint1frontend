"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminPanel from "../../components/admin-panel"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const path = window.location.pathname
    if (!path.startsWith("/admin")) {
      router.replace("/") // Redirect to homepage (or "/login" if needed)
      return
    }

    // Show loading screen briefly before rendering the admin panel
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white/80">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return <AdminPanel />
}
