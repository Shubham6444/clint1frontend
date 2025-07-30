const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        if (data.redirectTo) {
          if (typeof window !== "undefined") {
            window.location.href = data.redirectTo
          }
        }
        throw new Error(data.error || "Something went wrong")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: userData,
    })
  }

  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: credentials,
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  async forgotPassword(email) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: { email },
    })
  }

  async resetPassword(token, password) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: { token, password },
    })
  }

  // Home endpoint
  async getHomeData() {
    return this.request("/home")
  }

  // Plans endpoints
  async getPlans() {
    return this.request("/plans")
  }

  async getPlan(id) {
    return this.request(`/plans/${id}`)
  }

  async createCustomPlan(planData) {
    return this.request("/plans/custom", {
      method: "POST",
      body: planData,
    })
  }

  // Reviews endpoints
  async getReviews() {
    return this.request("/reviews")
  }

  async submitReview(reviewData) {
    return this.request("/reviews", {
      method: "POST",
      body: reviewData,
    })
  }

  async likeReview(reviewId) {
    return this.request(`/reviews/${reviewId}/like`, {
      method: "POST",
    })
  }

  // Payment endpoints
  async createPayment(paymentData) {
    return this.request("/payments/create-payment", {
      method: "POST",
      body: paymentData,
    })
  }

  async confirmPayment(paymentData) {
    return this.request("/payments/confirm-payment", {
      method: "POST",
      body: paymentData,
    })
  }

  async getPaymentHistory() {
    return this.request("/payments/history")
  }

  // Dashboard endpoints
  async getDashboard() {
    return this.request("/dashboard")
  }

  async getCurrentPlan() {
    return this.request("/dashboard/plan")
  }

  async updateYouTubeInfo(youtubeData) {
    return this.request("/dashboard/youtube", {
      method: "PUT",
      body: youtubeData,
    })
  }

  // Mission endpoints
  async getMissions() {
    return this.request("/missions")
  }

  async completeMission(missionId) {
    return this.request(`/missions/${missionId}/complete`, {
      method: "POST",
    })
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request("/admin/dashboard")
  }

  async getUserPurchases() {
    return this.request("/admin/purchases")
  }

  async createPlan(planData) {
    return this.request("/admin/plans", {
      method: "POST",
      body: planData,
    })
  }

  async updatePlan(planId, planData) {
    return this.request(`/admin/plans/${planId}`, {
      method: "PUT",
      body: planData,
    })
  }

  async getAdminReviews() {
    return this.request("/admin/reviews")
  }

  async createFakeReview(reviewData) {
    return this.request("/admin/reviews", {
      method: "POST",
      body: reviewData,
    })
  }

  async approveReview(reviewId) {
    return this.request(`/admin/reviews/${reviewId}/approve`, {
      method: "PUT",
    })
  }

  async getChannels() {
    return this.request("/admin/channels")
  }

  async createChannel(channelData) {
    return this.request("/admin/channels", {
      method: "POST",
      body: channelData,
    })
  }

  async updateChannel(channelId, channelData) {
    return this.request(`/admin/channels/${channelId}`, {
      method: "PUT",
      body: channelData,
    })
  }

  async getPromotedChannels() {
    return this.request("/channels/promoted")
  }
}

export const api = new ApiClient()
