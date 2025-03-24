import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if(!email || !password) {
        toast.error("Please enter your email and password")
        setIsLoading(false)
        return
    }
    
    try {
        const response = await axios.post("http://localhost:3000/auth/login", {
            email,
            password
        })
        
        // Make sure you're accessing the data correctly
        const data = response.data
        
        // Check status before proceeding
        if (data.status === "inactive" || data.status === "suspended") {
            toast.error("Please contact support for assistance.")
            setIsLoading(false)
            return
        }
        
        // Success case - both 200 and 201 status codes are treated as success
        if (response.status === 200 || response.status === 201) {
            // Store token and update auth context
            localStorage.setItem("token", data.access_token)
            
            // Use the login function from context and pass the user role
            const userRole = data.role || 'user'
            login(userRole)
            
            toast.success("Login successful!")
            
            // Navigate after a short delay
            setTimeout(() => {
              navigate("/") 
            }, 1000)
        } else {
            // This is an edge case - we received a non-error response code that's not 200/201
            toast.error("Unexpected response from server")
            setIsLoading(false)
        }
    } catch(error) {
        console.error("Login error:", error)
        setIsLoading(false)
        
        // Improved error handling with better structure
        if (error.response) {
            const { data, status } = error.response
            
            if (status === 401) {
                toast.error("Invalid email or password")
            } else if (data && (data.status === "inactive" || data.status === "suspended")) {
                toast.error("Please contact support for assistance.")
            } else if (data && data.message) {
                toast.error(data.message)
            } else {
                toast.error("Login failed. Please try again.")
            }
        } else if (error.request) {
            // The request was made but no response was received
            toast.error("No response from server. Please try again later.")
        } else {
            // Something happened in setting up the request
            toast.error("Login failed. Please try again.")
        }
    } finally {
        // In case we missed setting this somewhere
        setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-indigo-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border-0 bg-white shadow-lg">
        <div className="h-2 bg-gradient-to-r from-orange-600 to-indigo-600"></div>
        <div className="space-y-2 pb-6 pt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your account
          </p>
        </div>
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 h-11 rounded-lg border border-gray-200 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-orange-600 hover:text-orange-600">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 h-11 rounded-lg border border-gray-200 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full h-11 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors"
              disabled={isLoading}
            >
                <span className="flex items-center justify-center">
                  {isLoading ? "Signing in..." : "Sign in"}
                  {!isLoading && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </span>
            </button>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-orange-600 hover:text-orange-600 inline-flex items-center"
            >
              Create account 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}