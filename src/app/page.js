"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Youtube,
  DollarSign,
  Eye,
  ThumbsUp,
  MessageCircle,
  Zap,
  Crown,
  Sparkles,
  User,
  Loader2,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"
import Link from "next/link"

function AppSidebar() {
  const { user, isAuthenticated } = useAuth()

  const navigationItems = [
    { title: "Home", url: "/", icon: Youtube },
    { title: "Features", url: "#features", icon: Sparkles },
    { title: "Pricing", url: "#pricing", icon: DollarSign },
    { title: "Reviews", url: "#reviews", icon: Star },
    // { title: "Trending", url: "#trending", icon: TrendingUp },
    // { title: "Analytics", url: "#analytics", icon: Eye },
  ]

  const accountItems = isAuthenticated
    ? [
        { title: "Dashboard", url: "/dashboard", icon: User },
        // { title: "Profile", url: "/profile", icon: User },
        ...(user?.isAdmin ? [{ title: "Admin Panel", url: "/admin", icon: Crown }] : []),
      ]
    : [
        { title: "Sign In", url: "/login", icon: User },
        { title: "Sign Up", url: "/signup", icon: Sparkles },
      ]

  return (
    <Sidebar className="border-r border-white/20 md:hidden ">
      <SidebarHeader className="border-b border-white/20 bg-white/5 backdrop-blur-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center space-x-2 p-4">
          <Youtube className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold text-white">CreatorHub</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white/5 backdrop-blur-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white/80 hover:text-white hover:bg-white/10">
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 font-semibold">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white/80 hover:text-white hover:bg-white/10">
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/20 bg-white/5 backdrop-blur-md p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center text-white/60 text-sm">
          <p>&copy; 2024 CreatorHub</p>
          <p>All rights reserved</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function HomePage() {
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [likes, setLikes] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchHomeData()
    setIsVisible(true)
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      const data = await api.getHomeData()
      setHomeData(data)
    } catch (error) {
      console.error("Failed to fetch home data:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id, type = "video") => {
    if (type === "review") {
      try {
        const response = await api.likeReview(id)
        setLikes((prev) => ({
          ...prev,
          [`review-${id}`]: response.likes,
        }))
      } catch (error) {
        console.error("Failed to like review:", error)
      }
    } else {
      setLikes((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }))
    }
  }

  const handlePayment = async (planId) => {
    if (!isAuthenticated) {
      window.location.href = "/"
      return
    }

    // Redirect to buy plan page with plan ID
    window.location.href = `/dashboard`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Alert className="max-w-md bg-red-500/20 border-red-500/50 text-red-200">
          <AlertDescription>
            Failed to load data: {error}
            <Button onClick={fetchHomeData} className="mt-2 bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Layout with Sidebar */}
      <div className="md:hidden">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
              </div>

              {/* Mobile Navigation */}
              <nav className="relative z-50 backdrop-blur-md bg-white/10 border-b border-white/20 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                      <SidebarTrigger className="text-white hover:bg-white/10 border-white/20" />
                      <div className="flex items-center space-x-2">
                        <Youtube className="h-8 w-8 text-red-500" />
                        <span className="text-2xl font-bold text-white">CreatorHub</span>
                      </div>
                    </div>
                    {isAuthenticated && <div className="text-white/80 text-sm">Welcome, {user?.fullName}</div>}
                  </div>
                </div>
              </nav>

              {/* Rest of the mobile content */}
              <MobileContent
                homeData={homeData}
                isVisible={isVisible}
                likes={likes}
                handleLike={handleLike}
                handlePayment={handlePayment}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* Desktop Layout - Original Navigation */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        {/* Desktop Navigation */}
        <nav className="relative z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Youtube className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold text-white">CreatorHub</span>
              </div>
              <div className="flex items-center space-x-8">
                <a href="#features" className="text-white/80 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
                  Pricing
                </a>
                <a href="#reviews" className="text-white/80 hover:text-white transition-colors">
                  Reviews
                </a>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        Dashboard
                      </Button>
                    </Link>
                    <span className="text-white/80">Welcome, {user?.fullName}</span>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop Content */}
        <DesktopContent
          homeData={homeData}
          isVisible={isVisible}
          likes={likes}
          handleLike={handleLike}
          handlePayment={handlePayment}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </>
  )
}

// Mobile Content Component
function MobileContent({ homeData, isVisible, likes, handleLike, handlePayment, isAuthenticated }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-white/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              New: AI-Powered Analytics
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Grow Your YouTube
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Empire</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of creators who've transformed their channels with our cutting-edge tools, analytics, and
              monetization strategies. Start your journey to YouTube success today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
                onClick={() =>
                  !isAuthenticated ? (window.location.href = "/signup") : (window.location.href = "/dashboard")
                }
              >
                <Play className="w-5 h-5 mr-2" />
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Active Creators", value: homeData?.stats?.totalCreators || "50K+" },
              { icon: Eye, label: "Total Views", value: homeData?.stats?.totalViews || "2.5B+" },
              { icon: DollarSign, label: "Revenue Generated", value: homeData?.stats?.revenueGenerated || "$125M+" },
              { icon: TrendingUp, label: "Average Growth", value: homeData?.stats?.averageGrowth || "340%" },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border-white/20 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promoted Channels Section */}
      {homeData?.promotedChannels?.length > 0 && (
        <section className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Top Promoted Channels</h2>
              <p className="text-white/80 text-lg">Featured creators using our platform</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homeData.promotedChannels.map((channel) => (
                <Card
                  key={channel.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <CardContent className="p-6 text-center">
                    <img
                      src={channel.thumbnail || "/placeholder.svg?height=100&width=100"}
                      alt={channel.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-white mb-2">{channel.name}</h3>
                    <p className="text-white/80 mb-4">{channel.description}</p>
                    <div className="flex justify-center space-x-4 text-sm text-white/60">
                      <span>{channel.subscribers} subscribers</span>
                      <span>{channel.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscription Plans */}
      <section id="pricing" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-white/80 text-lg">Unlock your channel's potential with our powerful tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeData?.plans?.map((plan, index) => (
              <Card
                key={plan.id}
                className={`relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20 overflow-hidden transform hover:scale-105 transition-all duration-300 ${plan.popular ? "ring-2 ring-purple-400 shadow-2xl" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
                    <Crown className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                )}
                <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-white/80">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-white/80">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features?.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                  <Button
                    onClick={() => handlePayment(plan.id)}
                    className={`w-full mt-6 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : "bg-white/20 hover:bg-white/30"
                    } text-white font-semibold py-3`}
                  >
                    {plan.popular ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Get Started
                      </>
                    ) : (
                      "Choose Plan"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Creators Say</h2>
            <p className="text-white/80 text-lg">Join thousands of successful creators</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeData?.reviews?.map((review) => (
              <Card
                key={review.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src="/placeholder.svg" alt={review.name} />
                      <AvatarFallback>
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-white">{review.name}</h4>
                        {review.verified && <CheckCircle className="w-4 h-4 text-blue-400 ml-2" />}
                      </div>
                      <p className="text-white/60 text-sm">{review.subscribers} subscribers</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-4">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/80 hover:text-red-400"
                      onClick={() => handleLike(review.id, "review")}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {likes[`review-${review.id}`] || review.likes || 0}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white/80 hover:text-blue-400">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Review Button */}
          <div className="text-center mt-12">
            <Link href={isAuthenticated ? "/reviews" : "/login"}>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3">
                <Star className="w-4 h-4 mr-2" />
                {isAuthenticated ? "Write a Review" : "Login to Write Review"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Channel?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join over 50,000 creators who've already transformed their YouTube journey. Start your free trial today
                and see the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                  </Button>
                </Link>
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
                >
                  Schedule Demo
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-white/5 border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Youtube className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold text-white">CreatorHub</span>
              </div>
              <p className="text-white/80">Empowering creators to build successful YouTube channels.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 CreatorHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

// Desktop Content Component (similar structure but for desktop)
function DesktopContent({ homeData, isVisible, likes, handleLike, handlePayment, isAuthenticated }) {
  // Similar content structure as mobile but optimized for desktop
  return (
    <MobileContent
      homeData={homeData}
      isVisible={isVisible}
      likes={likes}
      handleLike={handleLike}
      handlePayment={handlePayment}
      isAuthenticated={isAuthenticated}
    />
  )
}
