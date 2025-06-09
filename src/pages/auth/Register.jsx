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
    Phone,
    Shield,
    Sparkles,
    Star,
    Upload,
    User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../../services/auth';


const Register = () => {
const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    matchPassword: "",
    id_proof: null,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
    
    // Clear alerts when user starts typing
    if (alert.message) {
      setAlert({ type: "", message: "" });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setAlert({ type: "error", message: "Please upload a valid image (JPG, PNG) or PDF file." });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ type: "error", message: "File size must be less than 5MB." });
        return;
      }
      
      setForm({
        ...form,
        id_proof: file,
      });
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setAlert({ type: "error", message: "Please enter your full name." });
      return false;
    }
    
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setAlert({ type: "error", message: "Please enter a valid email address." });
      return false;
    }
    
    if (!form.mobile.trim() || form.mobile.length < 10) {
      setAlert({ type: "error", message: "Please enter a valid mobile number." });
      return false;
    }
    
    if (form.password !== form.matchPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return false;
    }

    if (!form.id_proof) {
      setAlert({ type: "error", message: "ID proof is required for verification." });
      return false;
    }

    if (passwordStrength < 3) {
      setAlert({ type: "error", message: "Password is too weak. Please use a stronger password." });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('mobile', form.mobile);
    formData.append('password', form.password);
    formData.append('matchPassword', form.matchPassword);
    formData.append('id_proof', form.id_proof);

    setLoading(true);
    try {
      const response = await register(formData);
      
      if (response.data) {
        setAlert({ type: "success", message: "Registration successful! Please check your email for verification." });
        // Reset form on success
        setForm({
          name: "",
          email: "",
          mobile: "",
          password: "",
          matchPassword: "",
          id_proof: null,
        });
        setPasswordStrength(0);
        navigate("/login");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-400";
    if (passwordStrength <= 3) return "bg-amber-400";
    return "bg-emerald-400";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Light Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-indigo-100/20 to-blue-100/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-32 w-40 h-40 bg-gradient-to-r from-slate-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-md">
            {/* Logo/Brand */}
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-4 rounded-2xl shadow-sm">
                <Gavel className="w-10 h-10 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-700">BidBazaar</h1>
                <p className="text-indigo-500">Premium Auction Platform</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="mb-12">
              <h2 className="text-5xl font-bold text-gray-700 mb-6 leading-tight">
                Start Your
                <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent"> Bidding</span>
                <br />Journey Today
              </h2>
              <p className="text-xl text-gray-500 mb-8">
                Join thousands of successful bidders and discover exclusive items in our premium auction house.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: "Bank-level security for all transactions" },
                { icon: Star, text: "Verified sellers and authentic items" },
                { icon: Sparkles, text: "Exclusive access to premium auctions" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg shadow-sm border border-blue-100/50">
                    <feature.icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="text-gray-500">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-3 rounded-xl shadow-sm">
                <Gavel className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/80">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Create Account</h3>
                <p className="text-gray-500">Join the premium bidding experience</p>
              </div>

              {/* Alert */}
              {alert.message && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-center space-x-3 ${
                    alert.type === "error"
                      ? "bg-red-50/80 border border-red-200/60 text-red-600"
                      : "bg-emerald-50/80 border border-emerald-200/60 text-emerald-600"
                  }`}
                >
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
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          type="text"
                          name="name"
                          placeholder="PM Modi "
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Modi@example.com"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="+91 (555) 123-4567"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm"
                        value={form.mobile}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create password"
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
                      
                      {/* Password Strength */}
                      {form.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Strength</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength <= 2 ? 'text-red-500' : 
                              passwordStrength <= 3 ? 'text-amber-500' : 'text-emerald-500'
                            }`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200/60 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="matchPassword"
                          placeholder="Confirm password"
                          required
                          className="w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm"
                          value={form.matchPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {form.matchPassword && form.password !== form.matchPassword && (
                        <p className="mt-2 text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Passwords don't match
                        </p>
                      )}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      ID Verification
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-indigo-300 bg-indigo-50/50"
                          : "border-gray-300/60 hover:border-gray-400/60"
                      } ${form.id_proof ? "bg-emerald-50/50 border-emerald-300/60" : "bg-gray-50/30"}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        name="id_proof"
                        accept="image/*,application/pdf"
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                      />
                      <div className="flex flex-col items-center">
                        {form.id_proof ? (
                          <>
                            <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                            <p className="text-sm text-emerald-600 font-medium">
                              {form.id_proof.name}
                            </p>
                            <p className="text-xs text-emerald-500">Upload successful</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 font-medium">
                              Upload ID Document
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG, PDF (Max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-400 to-blue-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-indigo-400/25 hover:scale-105 transform"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer Links */}
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a 
                    href="/login" 
                    className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
                  >
                    Sign in
                  </a>
                </p>
                
                <p className="text-xs text-gray-400">
                  By creating an account, you agree to our{" "}
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

export default Register;