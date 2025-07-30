const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://clint1backend-production.up.railway.app/api";
// http://localhost:5000/api"

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // Skip authentication for admin endpoints
    const isAdminEndpoint = endpoint.startsWith("/admin")

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Only add Authorization header if token exists and it's not an admin endpoint
        ...(token &&
          token !== "null" &&
          token !== "undefined" &&
          !isAdminEndpoint && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      //console.log(`Making ${config.method || "GET"} request to: ${url}`)
      //console.log(`With headers:`, config.headers)

      const response = await fetch(url, config)
      const data = await response.json()

      //console.log(`Response status: ${response.status}`)
      //console.log(`Response data:`, data)

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
    //console.log("API login called with:", credentials)
    return this.request("/auth/login", {
      method: "POST",
      body: {
        emailOrPhone: credentials.emailOrPhone,
        password: credentials.password,
      },
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request("/admin/dashboard")
  }

  async getAdminDeals() {
    return this.request("/admin/deals")
  }

  async updateDealStatus(dealId, statusData) {
    return this.request(`/admin/deals/${dealId}/status`, {
      method: "PUT",
      body: statusData,
    })
  }

  async deleteDeal(dealId) {
    return this.request(`/admin/deals/${dealId}`, {
      method: "DELETE",
    })
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

  async deletePlan(planId) {
    return this.request(`/admin/plans/${planId}`, {
      method: "DELETE",
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

  async deleteReview(reviewId) {
    return this.request(`/admin/reviews/${reviewId}`, {
      method: "DELETE",
    })
  }

  async getAdminUsers() {
    return this.request("/admin/users")
  }

  async updateUser(userId, userData) {
    return this.request(`/admin/users/${userId}`, {
      method: "PUT",
      body: userData,
    })
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    })
  }

  // Regular user endpoints
  async createDeal(dealData) {
    return this.request("/deals/create", {
      method: "POST",
      body: dealData,
    })
  }

  async getMyDeals() {
    return this.request("/deals/my-deals")
  }

  async getDeal(dealId) {
    return this.request(`/deals/${dealId}`)
  }

  async getPlans() {
    return this.request("/plans")
  }

  async getPlan(id) {
    return this.request(`/plans/${id}`)
  }

  async getReviews() {
    return this.request("/reviews")
  }

  async submitReview(reviewData) {
    return this.request("/reviews", {
      method: "POST",
      body: reviewData,
    })
  }

  async getDashboard() {
    return this.request("/dashboard")
  }

  // Home page endpoints
  async getHomeData() {
    return this.request("/home")
  }

  async getHomeStats() {
    return this.request("/home/stats")
  }

  // Dashboard endpoints (user dashboard)
  async getUserDashboard() {
    return this.request("/user/dashboard")
  }

  async getUserStats() {
    return this.request("/user/stats")
  }

  // Channel endpoints
  async getChannels() {
    return this.request("/channels")
  }

  async getChannel(channelId) {
    return this.request(`/channels/${channelId}`)
  }

  async createChannel(channelData) {
    return this.request("/channels", {
      method: "POST",
      body: channelData,
    })
  }

  async updateChannel(channelId, channelData) {
    return this.request(`/channels/${channelId}`, {
      method: "PUT",
      body: channelData,
    })
  }

  async deleteChannel(channelId) {
    return this.request(`/channels/${channelId}`, {
      method: "DELETE",
    })
  }

  // Payment endpoints
  async createPayment(paymentData) {
    return this.request("/payments", {
      method: "POST",
      body: paymentData,
    })
  }

  async getPayments() {
    return this.request("/payments")
  }

  async getPayment(paymentId) {
    return this.request(`/payments/${paymentId}`)
  }

  async updatePaymentStatus(paymentId, status) {
    return this.request(`/payments/${paymentId}/status`, {
      method: "PUT",
      body: { status },
    })
  }

  // Profile endpoints
  async getProfile() {
    return this.request("/profile")
  }

  async updateProfile(profileData) {
    return this.request("/profile", {
      method: "PUT",
      body: profileData,
    })
  }

  // Subscription endpoints
  async getSubscriptions() {
    return this.request("/subscriptions")
  }

  async createSubscription(subscriptionData) {
    return this.request("/subscriptions", {
      method: "POST",
      body: subscriptionData,
    })
  }

  async cancelSubscription(subscriptionId) {
    return this.request(`/subscriptions/${subscriptionId}/cancel`, {
      method: "PUT",
    })
  }

  // Notification endpoints
  async getNotifications() {
    return this.request("/notifications")
  }

  async markNotificationRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: "PUT",
    })
  }

  // Settings endpoints
  async getSettings() {
    return this.request("/settings")
  }

  async updateSettings(settingsData) {
    return this.request("/settings", {
      method: "PUT",
      body: settingsData,
    })
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request("/analytics")
  }

  async getAnalyticsData(dateRange) {
    return this.request(`/analytics/data?range=${dateRange}`)
  }

  // Support endpoints
  async createSupportTicket(ticketData) {
    return this.request("/support/tickets", {
      method: "POST",
      body: ticketData,
    })
  }

  async getSupportTickets() {
    return this.request("/support/tickets")
  }

  // File upload endpoints
  async uploadFile(formData) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    return fetch(`${this.baseURL}/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData, // Don't stringify FormData
    }).then(async (response) => {
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }
      return data
    })
  }

  // Search endpoints
  async search(query, type = "all") {
    return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}`)
  }

  // Contact endpoints
  async submitContact(contactData) {
    return this.request("/contact", {
      method: "POST",
      body: contactData,
    })
  }

  // Newsletter endpoints
  async subscribeNewsletter(email) {
    return this.request("/newsletter/subscribe", {
      method: "POST",
      body: { email },
    })
  }

  // FAQ endpoints
  async getFAQs() {
    return this.request("/faqs")
  }

  // Testimonials endpoints
  async getTestimonials() {
    return this.request("/testimonials")
  }

  // Blog endpoints (if you have a blog)
  async getBlogPosts() {
    return this.request("/blog")
  }

  async getBlogPost(slug) {
    return this.request(`/blog/${slug}`)
  }

  // Referral endpoints
  async getReferrals() {
    return this.request("/referrals")
  }

  async createReferral(referralData) {
    return this.request("/referrals", {
      method: "POST",
      body: referralData,
    })
  }

  // Coupon endpoints
  async validateCoupon(couponCode) {
    return this.request(`/coupons/validate/${couponCode}`)
  }

  async applyCoupon(couponCode, planId) {
    return this.request("/coupons/apply", {
      method: "POST",
      body: { couponCode, planId },
    })
  }
}

export const api = new ApiClient()
