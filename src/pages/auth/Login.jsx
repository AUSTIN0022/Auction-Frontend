import {
    AlertCircle,
    ArrowRight,
    CheckCircle,
    Eye,
    EyeOff,
    Gavel,
    Loader2,
    Lock,
    Mail,
    Shield,
    Sparkles,
    Star
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "" });

    try {
      const res = await login(form);
      const { token, user } = res.data;

      // Store token in localStorage or context/state management
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log("Token:", token);
      console.log("User:", user);

      setAlert({ type: "success", message: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin-dashboard" : "/dashboard");
      }, 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Light Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-indigo-100/20 to-blue-100/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-32 w-40 h-40 bg-gradient-to-r from-slate-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-4 rounded-2xl shadow-sm">
                <Gavel className="w-10 h-10 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-700">BidBazaar</h1>
                <p className="text-indigo-500">Premium Auction Platform</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-5xl font-bold text-gray-700 mb-6 leading-tight">
                Welcome
                <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent"> Back</span>
              </h2>
              <p className="text-xl text-gray-500 mb-8">
                Continue your premium bidding experience with exclusive access to world-class auctions.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Shield, text: "Secure & encrypted sign-in" },
                { icon: Star, text: "Trusted by 500K+ bidders" },
                { icon: Sparkles, text: "Access premium auction listings" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg shadow-sm border border-blue-100/50">
                    <item.icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-xl">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-3 rounded-xl shadow-sm">
                <Gavel className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/80">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Welcome Back</h3>
                <p className="text-gray-500">Login to your premium account</p>
              </div>

              {alert.message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center space-x-3 ${
                  alert.type === "error"
                    ? "bg-red-50/80 border border-red-200/60 text-red-600"
                    : "bg-emerald-50/80 border border-emerald-200/60 text-emerald-600"
                }`}>
                  {alert.type === "error" ? (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{alert.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        required
                        className="w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm"
                        value={form.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <a href="/forgot-password" className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors">
                      Forgot your password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-400 to-blue-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-indigo-400/25 hover:scale-105 transform"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <a 
                    href="/register" 
                    className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
                  >
                    Create one now
                  </a>
                </p>

                <p className="text-xs text-gray-400">
                  By signing in, you agree to our{" "}
                  <a href="/terms" className="text-indigo-500 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-indigo-500 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;