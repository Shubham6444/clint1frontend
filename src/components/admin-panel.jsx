"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation" // Add this

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Crown,
  Users,
  DollarSign,
  Star,
  Plus,
  Check,
  X,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Trash2,
  RefreshCw,
} from "lucide-react"

// Remove all authentication-related props and state
export default function AdminPanel() {
  // const [adminData, setAdminData] = useState(null)
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)
  // const [success, setSuccess] = useState(null)
  // const [userPurchases, setUserPurchases] = useState([])
const router = useRouter()
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [userPurchases, setUserPurchases] = useState([])
 const api_url ="https://lssrz1rm-5000.inc1.devtunnels.ms/";
  useEffect(() => {
  const checkAdminAndFetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1️⃣ Check if user is authenticated and isAdmin
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || api_url}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!authRes.ok) throw new Error("Auth check failed")

      const authData = await authRes.json()

      if (!authData.isAdmin) {
        console.warn("User is not admin, redirecting...")
        router.push("/")
        return
      }

      // 2️⃣ Now fetch admin dashboard data
      const dashRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!dashRes.ok) {
        const err = await dashRes.json()
        throw ne
         Error(err.error || "Failed to fetch admin dashboard")
      }

      const dashboardData = await dashRes.json()
      setAdminData(dashboardData)

      // 3️⃣ Optionally fetch purchases
      const purchasesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/purchases`,
      )

      const purchasesData = purchasesRes.ok ? await purchasesRes.json() : []
      setUserPurchases(purchasesData)
    } catch (err) {
      console.error("Error loading admin panel:", err)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  checkAdminAndFetchData()
}, [router])

  // Form states
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    period: "/month",
    planType: "recurring",
    description: "",
    features: "",
    popular: false,
  })

  const [editingPlan, setEditingPlan] = useState(null)
  const [editPlanForm, setEditPlanForm] = useState({
    id: null,
    name: "",
    price: "",
    period: "/month",
    planType: "recurring",
    description: "",
    features: "",
    popular: false,
  })

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
    subscribers: "",
    verified: false,
  })

  // Remove all authentication useEffect and just fetch data directly


//   useEffect(() => {
//   //console.log("Admin panel: Starting to fetch admin data")
//   fetchAdminData()
// }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      //console.log("Making admin dashboard request without any authentication...")

      // Make request without any headers or authentication
     const adminResponse = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/dashboard`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);


      //console.log("Admin dashboard response status:", adminResponse.status)
        //console.log(adminResponse)
      if (!adminResponse.ok) {
        const errorData = await adminResponse.json()
        //console.log("Admin dashboard error:", errorData)
        throw new Error(errorData.error || "Failed to fetch admin data")
      }

      const adminData = await adminResponse.json()
      //console.log("Admin data received successfully:", adminData)

      // Try to fetch purchases data without authentication
      try {
        //console.log("Making purchases request without authentication...")
        const purchasesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/purchases`,
        )

        if (purchasesResponse.ok) {
          const purchasesData = await purchasesResponse.json()
          //console.log("Purchases data received:", purchasesData)
          setUserPurchases(purchasesData)
        } else {
          //console.log("Failed to fetch purchases, continuing without them")
          setUserPurchases([])
        }
      } catch (purchaseError) {
        //console.log("Purchase fetch error (non-critical):", purchaseError)
        setUserPurchases([])
      }

      setAdminData(adminData)
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const makeRequest = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        // Never send any authentication headers for admin requests
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Request failed")
    }

    return response.json()
  }

  // Update all API calls to use makeRequest instead of makeAuthenticatedRequest
  const handleCreatePlan = async (e) => {
    e.preventDefault()
    try {
      const features = planForm.features.split("\n").filter((f) => f.trim())

      await makeRequest(`${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/plans`, {
        method: "POST",
        body: JSON.stringify({
          ...planForm,
          features,
          price: Number.parseFloat(planForm.price),
        }),
      })

      setSuccess("Plan created successfully!")
      setPlanForm({
        name: "",
        price: "",
        period: "/month",
        planType: "recurring",
        description: "",
        features: "",
        popular: false,
      })
      fetchAdminData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEditPlan = (plan) => {
    setEditingPlan(plan)
    setEditPlanForm({
      id: plan.id,
      name: plan.name,
      price: plan.price.toString(),
      period: plan.period || "/month",
      planType: plan.planType || "recurring",
      description: plan.description || "",
      features: plan.features ? plan.features.join("\n") : "",
      popular: plan.popular || false,
    })
  }

  const handleUpdatePlan = async (e) => {
    e.preventDefault()
    try {
      const features = editPlanForm.features.split("\n").filter((f) => f.trim())

      await makeRequest(
        `${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/plans/${editPlanForm.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...editPlanForm,
            features,
            price: Number.parseFloat(editPlanForm.price),
          }),
        },
      )

      setSuccess("Plan updated successfully!")
      setEditingPlan(null)
      setEditPlanForm({
        id: null,
        name: "",
        price: "",
        period: "/month",
        planType: "recurring",
        description: "",
        features: "",
        popular: false,
      })
      fetchAdminData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDeletePlan = async (planId) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    try {
      await makeRequest(`${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/plans/${planId}`, {
        method: "DELETE",
      })

      setSuccess("Plan deleted successfully!")
      fetchAdminData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCreateReview = async (e) => {
    e.preventDefault()
    try {
      await makeRequest(`${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewForm),
      })

      setSuccess("Review created successfully!")
      setReviewForm({ name: "", rating: 5, comment: "", subscribers: "", verified: false })
      fetchAdminData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleApproveReview = async (reviewId) => {
    try {
      await makeRequest(
        `${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/reviews/${reviewId}/approve`,
        {
          method: "PUT",
        },
      )

      setSuccess("Review approved successfully!")
      fetchAdminData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleUpdateDealStatus = async (dealId, status, adminNotes) => {
    try {
      await makeRequest(
        `${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/deals/${dealId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status, adminNotes }),
        },
      )

      setSuccess(`Deal status updated to ${status}!`)
      fetchAdminData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDeleteDeal = async (dealId) => {
    if (!confirm("Are you sure you want to delete this deal?")) return

    try {
      await makeRequest(`${process.env.NEXT_PUBLIC_API_URL || api_url}/admin/deals/${dealId}`, {
        method: "DELETE",
      })

      setSuccess("Deal deleted successfully!")
      fetchAdminData()
    } catch (error) {
      setError(error.message)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  // Remove the logout button and authentication-related UI
  // Remove all authentication checks and user props

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
             <div
  className="w-8 h-8 mr-3 text-yellow-400"
  style={{ animation: 'flip-lattoo 1s ease-in-out infinite alternate' }}
>
  <Crown />
</div>

<style>{`
  @keyframes flip-lattoo {
    0% {
      transform: rotate(-15deg);
    }
    100% {
      transform: rotate(15deg);
    }
  }
`}</style>

              Admin Panel
            </h1>
            <p className="text-white/80">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={fetchAdminData}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/50 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              {error}
              <Button onClick={clearMessages} variant="ghost" size="sm" className="text-red-200 hover:text-red-100">
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-500/20 border-green-500/50 text-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              {success}
              <Button onClick={clearMessages} variant="ghost" size="sm" className="text-green-200 hover:text-green-100">
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{adminData?.stats?.totalUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Deals</p>
                  <p className="text-2xl font-bold text-white">{adminData?.stats?.totalDeals || 0}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{adminData?.stats?.totalRevenue || 0}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Pending Reviews</p>
                  <p className="text-2xl font-bold text-white">{adminData?.stats?.pendingReviews || 0}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="deals" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="deals" className="data-[state=active]:bg-purple-600">
              <CreditCard className="w-4 h-4 mr-2" />
              Deals ({adminData?.stats?.totalDeals || 0})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Users ({adminData?.stats?.totalUsers || 0})
            </TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Plans ({adminData?.stats?.totalPlans || 0})
            </TabsTrigger>
              </TabsList>

                        <TabsList className="bg-white/10 backdrop-blur-md border-white/20">

            <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-600">
              <Star className="w-4 h-4 mr-2" />
              Reviews ({adminData?.stats?.totalReviews || 0})
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-purple-600">
              <CreditCard className="w-4 h-4 mr-2" />
              Purchases
            </TabsTrigger>
          </TabsList>

          {/* Deals Management */}
          <TabsContent value="deals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Deals</h2>
            </div>

            {adminData?.allDeals && adminData.allDeals.length > 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">All Deals</CardTitle>
                  <CardDescription className="text-white/80">Manage user deals and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-white">ID</TableHead>
                          <TableHead className="text-white">User</TableHead>
                          <TableHead className="text-white">Plan</TableHead>
                          <TableHead className="text-white">Channel</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          <TableHead className="text-white">Amount</TableHead>
                          <TableHead className="text-white">Created</TableHead>
                          <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminData.allDeals.map((deal) => (
                          <TableRow key={deal.id} className="border-white/10">
                            <TableCell className="text-white">{deal.id}</TableCell>
                            <TableCell className="text-white">
                              <div>
                                <p className="font-medium">{deal.user?.fullName || "Unknown"}</p>
                                <p className="text-sm text-white/60">{deal.user?.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">{deal.planName}</TableCell>
                            <TableCell className="text-white">
                              <div>
                                <p className="font-medium">{deal.channelInfo?.channelName}</p>
                                {/* <p className="text-sm text-white/60">
                                  {deal.channelInfo?.currentSubscribers} → {deal.channelInfo?.targetSubscribers}
                                </p> */}
                               


                            <Badge > <a href={deal.channelInfo?.channelUrl}>Click</a>                        
                              </Badge>

                            




                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  deal.status === "completed"
                                    ? "bg-green-500/20 text-green-300 border-green-500/50"
                                    : deal.status === "in_progress"
                                      ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                                      : deal.status === "pending"
                                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                                        : "bg-red-500/20 text-red-300 border-red-500/50"
                                }
                              >
                                {deal.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white">₹{deal.planPrice}
<br />
                              <p>UTR : {deal.channelInfo?.utrNumber}  </p>
                            </TableCell>
                           
                            <TableCell className="text-white/60 text-sm">
                              {new Date(deal.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Select
                                  onValueChange={(status) => handleUpdateDealStatus(deal.id, status)}
                                  defaultValue={deal.status}
                                >
                                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteDeal(deal.id)}
                                  className="border-red-500/50 text-red-300 hover:bg-red-500/20 bg-transparent"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="pt-6 text-center">
                  <CreditCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No deals found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">User Management</h2>

            {adminData?.allUsers && adminData.allUsers.length > 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">All Users</CardTitle>
                  <CardDescription className="text-white/80">Manage platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-white">ID</TableHead>
                          <TableHead className="text-white">Name</TableHead>
                          <TableHead className="text-white">Email</TableHead>
                          <TableHead className="text-white">WhatsApp</TableHead>
                          <TableHead className="text-white">Role</TableHead>
                          <TableHead className="text-white">Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminData.allUsers.map((user) => (
                          <TableRow key={user.id} className="border-white/10">
                            <TableCell className="text-white">{user.id}</TableCell>
                            <TableCell className="text-white font-medium">{user.fullName}</TableCell>
                            <TableCell className="text-white">{user.email}</TableCell>
<TableCell className="text-white">
  <a
    href={`https://wa.me/+91${user.whatsappNumber}?text=hi`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-400 underline hover:text-green-300"
  >
    +91 {user.whatsappNumber}
  </a>
</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.isAdmin
                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                                    : "bg-gray-500/20 text-gray-300 border-gray-500/50"
                                }
                              >
                                {user.isAdmin ? "Admin" : "User"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white/60 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="pt-6 text-center">
                  <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No users found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Plans Management */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Plans</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Plan</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Add a new subscription plan for users
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePlan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Plan Name</Label>
                        <Input
                          value={planForm.name}
                          onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-white">Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={planForm.price}
                          onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Plan Type</Label>
                      <Select
                        value={planForm.planType}
                        onValueChange={(value) => setPlanForm({ ...planForm, planType: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurring">Recurring</SelectItem>
                          <SelectItem value="one-time">One-time Mission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Description</Label>
                      <Input
                        value={planForm.description}
                        onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Features (one per line)</Label>
                      <Textarea
                        value={planForm.features}
                        onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        rows={4}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={planForm.popular}
                        onCheckedChange={(checked) => setPlanForm({ ...planForm, popular: checked })}
                      />
                      <Label className="text-white">Mark as Popular</Label>
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Create Plan
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {adminData?.allPlans && adminData.allPlans.length > 0 ? (
              <div className="grid gap-6">
                {adminData.allPlans.map((plan) => (
                  <Card key={plan.id} className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white flex items-center">
                            {plan.name}
                            {plan.popular && (
                              <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                                Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-white/80">{plan.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">₹{plan.price}</p>
                            <p className="text-white/60 text-sm">{plan.period}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditPlan(plan)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePlan(plan.id)}
                              className="border-red-500/50 text-red-300 hover:bg-red-500/20 bg-transparent"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {plan.features?.map((feature, index) => (
                          <div key={index} className="flex items-center text-white/80">
                            <Check className="w-4 h-4 mr-2 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="pt-6 text-center">
                  <DollarSign className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No plans created yet</p>
                </CardContent>
              </Card>
            )}

            {/* Edit Plan Dialog */}
            {editingPlan && (
              <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
                <DialogContent className="bg-slate-900 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Edit Plan</DialogTitle>
                    <DialogDescription className="text-white/80">Update the plan details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdatePlan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Plan Name</Label>
                        <Input
                          value={editPlanForm.name}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, name: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-white">Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editPlanForm.price}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, price: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Plan Type</Label>
                      <Select
                        value={editPlanForm.planType}
                        onValueChange={(value) => setEditPlanForm({ ...editPlanForm, planType: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurring">Recurring</SelectItem>
                          <SelectItem value="one-time">One-time Mission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Description</Label>
                      <Input
                        value={editPlanForm.description}
                        onChange={(e) => setEditPlanForm({ ...editPlanForm, description: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Features (one per line)</Label>
                      <Textarea
                        value={editPlanForm.features}
                        onChange={(e) => setEditPlanForm({ ...editPlanForm, features: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        rows={4}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editPlanForm.popular}
                        onCheckedChange={(checked) => setEditPlanForm({ ...editPlanForm, popular: checked })}
                      />
                      <Label className="text-white">Mark as Popular</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Update Plan
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingPlan(null)}
                        className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Reviews Management */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Reviews</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create Review</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Add a promotional review to showcase
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateReview} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Reviewer Name</Label>
                        <Input
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-white">Subscribers</Label>
                        <Input
                          value={reviewForm.subscribers}
                          onChange={(e) => setReviewForm({ ...reviewForm, subscribers: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="e.g., 125K"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Rating</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`text-2xl transition-colors ${
                              star <= reviewForm.rating ? "text-yellow-400" : "text-white/30"
                            }`}
                          >
                            <Star className={`w-6 h-6 ${star <= reviewForm.rating ? "fill-current" : ""}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Review Comment</Label>
                      <Textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={reviewForm.verified}
                        onCheckedChange={(checked) => setReviewForm({ ...reviewForm, verified: checked })}
                      />
                      <Label className="text-white">Mark as Verified</Label>
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Create Review
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Pending Reviews */}
            {adminData?.pendingReviews && adminData.pendingReviews.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Pending Reviews</CardTitle>
                  <CardDescription className="text-white/80">Reviews waiting for approval</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adminData.pendingReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-white">{review.name}</h4>
                          <div className="flex ml-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/80 text-sm mb-2">"{review.comment}"</p>
                        <p className="text-white/60 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveReview(review.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* All Reviews */}
            {adminData?.allReviews && adminData.allReviews.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">All Reviews</CardTitle>
                  <CardDescription className="text-white/80">All platform reviews</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adminData.allReviews.slice(0, 10).map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-white">{review.name}</h4>
                          <div className="flex ml-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          {review.verified && (
                            <Badge className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs">
                              Verified
                            </Badge>
                          )}
                          {review.isFake && (
                            <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mb-2">"{review.comment}"</p>
                        <p className="text-white/60 text-xs">
                          {new Date(review.createdAt).toLocaleDateString()} • {review.likes || 0} likes
                        </p>
                      </div>
                      <Badge
                        className={
                          review.approved
                            ? "bg-green-500/20 text-green-300 border-green-500/50"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                        }
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Purchases Management */}
          <TabsContent value="purchases" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">User Purchases</h2>

            {userPurchases.length > 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">All Purchases</CardTitle>
                  <CardDescription className="text-white/80">All plan purchases and deals by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-white">Type</TableHead>
                          <TableHead className="text-white">User</TableHead>
                          <TableHead className="text-white">Plan</TableHead>
                          <TableHead className="text-white">Amount</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          <TableHead className="text-white">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userPurchases.map((purchase) => (
                          <TableRow key={purchase.id} className="border-white/10">
                            <TableCell>
                              <Badge
                                className={
                                  purchase.type === "payment"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                                    : "bg-purple-500/20 text-purple-300 border-purple-500/50"
                                }
                              >
                                {purchase.type === "payment" ? "Payment" : "Deal"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white">
                              <div>
                                <p className="font-medium">{purchase.userName}</p>
                                <p className="text-sm text-white/60">{purchase.userEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">
                              <div>
                                <p className="font-medium">{purchase.planName}</p>
                                {purchase.channelInfo && (
                                  <p className="text-sm text-white/60">{purchase.channelInfo.channelName}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-medium">${purchase.amount}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  purchase.status === "completed"
                                    ? "bg-green-500/20 text-green-300 border-green-500/50"
                                    : purchase.status === "in_progress"
                                      ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                                      : purchase.status === "pending"
                                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                                        : "bg-red-500/20 text-red-300 border-red-500/50"
                                }
                              >
                                {purchase.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white/60 text-sm">
                              {new Date(purchase.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="pt-6 text-center">
                  <CreditCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No purchases found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
