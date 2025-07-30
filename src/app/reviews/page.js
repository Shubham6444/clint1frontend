"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Youtube,
  Star,
  Send,
  ThumbsUp,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"
import Link from "next/link"

export default function ReviewsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login"
      return
    }

    if (isAuthenticated) {
      fetchReviews()
    }
  }, [isAuthenticated, authLoading])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await api.getReviews()
      setReviews(data)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.comment.trim()) {
      setError("Please write a comment")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await api.submitReview(formData)

      setSuccess("Review submitted successfully! It will be visible after admin approval.")
      setFormData({ rating: 5, comment: "" })

      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error("Failed to submit review:", error)
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (reviewId) => {
    try {
      const response = await api.likeReview(reviewId)
      setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: response.likes } : review)))
    } catch (error) {
      console.error("Failed to like review:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white/80">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Share Your Experience</h1>
          <p className="text-white/80 text-lg">Help other creators by sharing your review</p>
        </div>

        {/* Submit Review Form */}
        <Card className="mb-12 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Write a Review
            </CardTitle>
            <CardDescription className="text-white/80">Share your experience with CreatorHub</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 bg-red-500/20 border-red-500/50 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-500/20 border-green-500/50 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div className="space-y-2">
                <Label className="text-white">Rating</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className={`text-2xl transition-colors ${
                        star <= formData.rating ? "text-yellow-400" : "text-white/30"
                      }`}
                    >
                      <Star className={`w-6 h-6 ${star <= formData.rating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                  <span className="text-white/80 ml-2">
                    {formData.rating} star{formData.rating !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-white">
                  Your Review
                </Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Tell us about your experience with CreatorHub..."
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-purple-400"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Reviews */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Community Reviews</h2>

          {reviews.length > 0 ? (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
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
                            {review.isFake && (
                              <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-white/60 text-sm">{review.subscribers} subscribers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex mb-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-white/60 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <p className="text-white/90 mb-4">"{review.comment}"</p>

                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/80 hover:text-red-400"
                        onClick={() => handleLike(review.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {review.likes || 0}
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
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6 text-center">
                <Star className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No reviews yet. Be the first to share your experience!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
