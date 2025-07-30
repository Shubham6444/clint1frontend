"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Youtube, Target, CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function BuyPlan() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const planId = searchParams.get("planId")

  const [plan, setPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dealId, setDealId] = useState("")

  const [formData, setFormData] = useState({
    channelName: "",
    channelUrl: "",
    currentSubscribers: "",
    utrNumber: "",
  })

  const upiUrl = `upi://pay?pa=BHARATPE.8W0V0G8J0B12014@fbpe&pn=BharatPe%20Merchant&am=${plan?.price || 100}&cu=INR&tn=Pay`;

  const fetchPlan = useCallback(async () => {
    try {
      const data = await api.getPlan(planId)
      setPlan(data)
    } catch (error) {
      setError("Failed to load plan details")
    }
  }, [planId])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (planId) {
      fetchPlan()
    }
  }, [isAuthenticated, planId, fetchPlan, router])

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/|c\/|user\/)|youtu\.be\/)/
    return youtubeRegex.test(url)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDealCreate = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!validateYouTubeUrl(formData.channelUrl)) {
      setError("Please enter a valid YouTube channel URL")
      setIsLoading(false)
      return
    }

    const current = parseInt(formData.currentSubscribers)
    const target = parseInt(formData.utrNumber)

    if (target <= current) {
      setError("Target subscribers must be greater than current subscribers")
      setIsLoading(false)
      return
    }

    if (!formData.utrNumber || formData.utrNumber.length !== 12) {
      setError("Enter a valid 12-digit UTR number")
      setIsLoading(false)
      return
    }

    try {
      const response = await api.createDeal({
        planId: plan.id,
        channelName: formData.channelName,
        channelUrl: formData.channelUrl,
        currentSubscribers: formData.currentSubscribers,
        utrNumber: formData.utrNumber,
      })
      setDealId(response.id)
      setSuccess("Deal created successfully! Admin will review and activate your deal.")
      setTimeout(() => router.push("/dashboard"), 3000)
    } catch (err) {
      setError(err.message || "Failed to create deal")
    } finally {
      setIsLoading(false)
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white/80">Loading plan details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Plan Details */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                {plan.name}
              </CardTitle>
              <CardDescription className="text-white/80">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">₹{plan.price}</div>
                <p className="text-white/60">One-time payment</p>
                {plan.popular && (
                  <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Most Popular
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">What you get:</h4>
                <ul className="space-y-2">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="text-white/90 text-sm flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Alert className="bg-blue-500/20 border-blue-500/50 text-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This is a deal-based service. Admin will manually fulfill your order after payment confirmation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* YouTube Info + UPI Modal */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                YouTube Channel Information
              </CardTitle>
              <CardDescription className="text-white/80">
                Provide your YouTube channel details to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/20 border-green-500/50 text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="channelName" className="text-white">Channel Name *</Label>
                <Input
                  id="channelName"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleInputChange}
                  placeholder="Your YouTube Channel Name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelUrl" className="text-white">Channel URL *</Label>
                <Input
                  id="channelUrl"
                  name="channelUrl"
                  value={formData.channelUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/channel/..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSubscribers" className="text-white">Current Subscribers *</Label>
                <Input
                  id="currentSubscribers"
                  name="currentSubscribers"
                  type="number"
                  value={formData.currentSubscribers}
                  onChange={handleInputChange}
                  placeholder="e.g. 1000"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>

              <p className="text-xs text-white/60 text-center">
                Admin will review and activate your deal within 24 hours.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-600 text-white" onClick={handleDealCreate}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                </DialogTrigger>

                <DialogContent className="text-center bg-green-900 text-white border border-white/20">
                  <DialogHeader>
                    <DialogTitle>Confirm Payment</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Scan the QR or open UPI app to pay ₹{plan.price}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex justify-center my-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiUrl)}&size=180x180`}
                      alt="QR Code"
                      className="rounded-lg border p-1 bg-white"
                    />
                  </div>

                  <a href={upiUrl} target="_blank">
                    <Button className="w-full bg-green-700 mt-2">Open in UPI App</Button>
                  </a>

                  <div className="mt-4 text-left">
                    <Label htmlFor="utrNumber" className="text-white">UTR Number *</Label>
                    <Input
                      id="utrNumber"
                      name="utrNumber"
                      type="text"
                      pattern="\d{12}"
                      maxLength={12}
                      minLength={12}
                      value={formData.utrNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 100933262085"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                    />
                    <p className="text-xs mt-1 text-white/60">
                      You’ll find the 12-digit UTR in your UPI app after payment.
                    </p>
                  </div>

                  <Button
                    onClick={handleDealCreate}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 mt-4"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Creating Deal...
                      </div>
                    ) : (
                      <>Create Deal - ₹{plan.price}</>
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
