"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

import {
  Youtube,
  Users,
  Eye,
  Menu,
  DollarSign,
  Crown,
  Settings,
  BarChart3,
  PlayCircle,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  X
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await api.getDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
      case "in_progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50"
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/50"
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />
      case "in_progress":
        return <TrendingUp className="w-3 h-3" />
      case "completed":
        return <CheckCircle className="w-3 h-3" />
      case "cancelled":
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Package className="w-3 h-3" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white/80">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-red-500/20 border-red-500/50 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard: {error}
            <Button onClick={fetchDashboardData} className="mt-2 bg-red-600 hover:bg-red-700 w-full">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Youtube className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-white">CreatorHub</span>
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-white/80">Welcome, {user?.fullName}</span>
            {user?.isAdmin && (
              <Link href="/admin">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Crown className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <div className="text-white/80">Welcome, {user?.fullName}</div>
            {user?.isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <Crown className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
       <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
    <p className="text-white/80">Track your deals and channel growth</p>
  </div>
  
  {/* WhatsApp Support Button */}
  <a
    href="https://wa.me/918445685433" // Replace with your actual number
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      
    >
      <path d="M20.52 3.48a12.01 12.01 0 0 0-17 0c-4.23 4.24-4.23 11.1 0 15.34l-1.52 5.18 5.34-1.4c1.5.41 3.09.6 4.68.54a11.99 11.99 0 0 0 8.5-3.53c4.23-4.24 4.23-11.1 0-15.34Zm-8.51 17.44c-1.42.04-2.84-.14-4.2-.52l-.3-.09-3.16.83.87-3.02-.2-.32a9.51 9.51 0 0 1 1.31-11.62c3.72-3.73 9.78-3.73 13.5 0 3.72 3.73 3.72 9.79 0 13.52a9.47 9.47 0 0 1-7.82 2.22Zm4.73-6.86c-.26-.13-1.55-.76-1.79-.84-.24-.09-.41-.13-.59.13-.17.25-.68.84-.84 1.01-.15.17-.31.2-.58.07-.26-.13-1.11-.41-2.12-1.3-.78-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.11-.11.25-.29.37-.43.12-.14.16-.25.25-.42.08-.17.04-.32-.02-.45-.07-.13-.59-1.41-.8-1.93-.21-.52-.42-.45-.59-.45h-.5c-.17 0-.44.06-.67.29-.23.23-.9.87-.9 2.11s.92 2.45 1.05 2.62c.13.17 1.81 2.77 4.39 3.89.61.26 1.09.41 1.46.52.61.19 1.17.17 1.61.1.49-.07 1.55-.63 1.77-1.24.22-.61.22-1.14.15-1.25-.07-.11-.24-.17-.5-.3Z"/>
    </svg>
    <span> Support</span>
  </a>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Deals</p>
                  <p className="text-2xl font-bold text-white">{dashboardData?.stats?.totalDeals || 0}</p>
                </div>
                <Package className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Active Deals</p>
                  <p className="text-2xl font-bold text-white">{dashboardData?.stats?.activeDeals || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Completed Deals</p>
                  <p className="text-2xl font-bold text-white">{dashboardData?.stats?.completedDeals || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-white">₹{dashboardData?.stats?.totalSpent || 0}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Deals Message */}
        {(!dashboardData?.deals || dashboardData.deals.length === 0) && (
          <Alert className="mb-8 bg-blue-500/20 border-blue-500/50 text-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You haven't created any deals yet.{" "}
              <Link href="/#pricing" className="underline font-semibold">
                Browse our plans
              </Link>{" "}
              to get started with growing your YouTube channel.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="deals" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="deals" className="data-[state=active]:bg-purple-600">
              <Package className="w-4 h-4 mr-2" />
              My Deals
            </TabsTrigger>
            {/* <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger> */}
            <TabsTrigger value="plans" className="data-[state=active]:bg-purple-600">
              <Crown className="w-4 h-4 mr-2" />
              All Plans
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-6">
            {dashboardData?.deals && dashboardData.deals.length > 0 ? (
              <div className="grid gap-6">
                {dashboardData.deals.map((deal) => (
                  <Card key={deal.id} className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{deal.planName}</CardTitle>
                          <CardDescription className="text-white/80">
                            Created on {new Date(deal.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(deal.status)}>
                          {getStatusIcon(deal.status)}
                          <span className="ml-1 capitalize">{deal.status.replace("_", " ")}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Channel Information</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-white/80">
                              <span className="font-medium">Name:</span> {deal.channelInfo.channelName}
                            </p>
                            <p className="text-white/80">
                              <span className="font-medium">URL:</span>{" "}
                              <a
                                href={deal.channelInfo.channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 underline"
                              >
                              {/* {deal.channelInfo.channelUrl.slice(0, 30)} */}
                              click view you cannal

                              </a>
                            </p>
                            <p className="text-white/80">
                              <span className="font-medium">Current Subscribers:</span>{" "}
                              {deal.channelInfo.currentSubscribers.toLocaleString()}
                            </p>
                            <p className="text-white/80">
                              <span className="font-medium">UTR Number:</span>{" "}
                              {deal.channelInfo.utrNumber}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">Deal Details</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-white/80">
                              <span className="font-medium">Price:</span> ₹{deal.planPrice}
                            </p>
                           <p className="text-white/80">
  <span className="font-medium">Status:</span>{" "}
  <span className="capitalize">
    {deal.status.replace("_", " ")} (
    {
      deal.status === "cancelled"
        ? "payment not done"
        : deal.status === "pending"
        ? "wait for verify"
        : deal.status === "in_progress"
        ? "payment done"
        : deal.status === "completed"
        ? "completed"
        : "unknown"
    }
    )
  </span>
</p>

                            {deal.completedAt && (
                              <p className="text-white/80">
                                <span className="font-medium">Completed:</span>{" "}
                                {new Date(deal.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {deal.adminNotes && (
                        <div>
                          <h4 className="text-white font-semibold mb-2">Admin Notes</h4>
                          <p className="text-white/80 text-sm bg-white/5 p-3 rounded-lg">{deal.adminNotes}</p>
                        </div>
                      )}
                      {deal.channelInfo.description && (
                        <div>
                          <h4 className="text-white font-semibold mb-2">Channel Description</h4>
                          <p className="text-white/80 text-sm">{deal.channelInfo.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="pt-6 text-center">
                  <Package className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Deals Yet</h3>
                  <p className="text-white/60 mb-4">
                    You haven't created any deals yet. Start growing your channel today!
                  </p>
                  <Link href="/#pricing">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Browse Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab
          <TabsContent value="analytics" className="space-y-6">
            {dashboardData?.analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6 text-center">
                    <Eye className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {dashboardData.analytics.channelViews.toLocaleString()}
                    </p>
                    <p className="text-white/80 text-sm">Channel Views</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {dashboardData.analytics.subscribers.toLocaleString()}
                    </p>
                    <p className="text-white/80 text-sm">Subscribers</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6 text-center">
                    <PlayCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{dashboardData.analytics.videosUploaded}</p>
                    <p className="text-white/80 text-sm">Videos Uploaded</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">₹{dashboardData.analytics.revenue}</p>
                    <p className="text-white/80 text-sm">Revenue</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="pt-6 text-center">
                  <BarChart3 className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Locked</h3>
                  <p className="text-white/60 mb-4">Complete a deal to unlock detailed analytics and insights</p>
                  <Link href="/#pricing">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      View Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent> */}

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData?.availablePlans?.map((plan) => (
                <Card key={plan.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-white/80">{plan.description}</CardDescription>
                    <div className="text-3xl font-bold text-white">
                      ₹{plan.price}
                      <span className="text-lg text-white/80"> one-time</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white/90 text-sm">{feature}</span>
                      </div>
                    ))}
                    <Link href={`/buy-plan?planId=${plan.id}`}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Get This Deal
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
                <CardDescription className="text-white/80">Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm">Full Name</label>
                    <p className="text-white font-medium">{user?.fullName}</p>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm">Email</label>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm">WhatsApp Number</label>
                    <p className="text-white font-medium">{user?.whatsappNumber}</p>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm">Member Since</label>
                    <p className="text-white font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
