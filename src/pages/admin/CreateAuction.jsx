// src/pages/admin/CreateAuction.jsx
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    DollarSign,
    FileText,
    Image as ImageIcon,
    Save,
    Send,
    Tag,
    Upload,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { createAuction, getAuctionCategories } from "../../services/adminAuctions";

const CreateAuction = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    categorie: "",
    title: "",
    description: "",
    basePrice: "",
    emdAmount: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("draft");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAuctionCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => setAlert({ type: "error", message: "Failed to load categories" }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setAlert({ type: "error", message: "Maximum 5 images allowed" });
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (publish = false) => {
    if (images.length < 2) {
      return setAlert({ type: "error", message: "Minimum 2 images required" });
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    formData.append("status", publish ? "pending" : "draft");
    formData.append("createdBy", user.id);
    images.forEach((img) => formData.append("auction_images", img));

    try {
      setLoading(true);
      await createAuction(formData);
      setAlert({ type: "success", message: "Auction created successfully!" });
      setTimeout(() => navigate("/admin-dashboard"), 1500);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to create auction" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Auction</h1>
          <p className="text-gray-600">Fill in the details below to create a new auction listing</p>
        </div>

        {/* Alert Message */}
        {alert && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 flex items-center gap-3 ${
            alert.type === "error" 
              ? "bg-red-50 border-red-400 text-red-700" 
              : "bg-green-50 border-green-400 text-green-700"
          }`}>
            {alert.type === "error" ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 lg:p-8">
            <div className="space-y-8">
              
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Category *
                    </label>
                    <select
                      name="categorie"
                      value={form.categorie}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Title *
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter a descriptive title for your auction item"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Provide detailed description of the item, including condition, specifications, etc."
                      rows={5}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Pricing Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price (₹) *
                    </label>
                    <input
                      name="basePrice"
                      value={form.basePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EMD Amount (₹) *
                    </label>
                    <input
                      name="emdAmount"
                      value={form.emdAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date Settings Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Date Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline *
                    </label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={form.registrationDeadline}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  Images ({images.length}/5)
                </h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                        disabled={images.length >= 5}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Images
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload 2-5 high-quality images (JPG, PNG, WebP)
                      </p>
                    </div>

                    {/* Image Preview Grid */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                        {images.map((img, i) => (
                          <div key={i} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {images.length < 2 && (
                  <p className="text-sm text-red-600 mt-2">
                    * Minimum 2 images are required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 lg:px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors inline-flex items-center justify-center gap-2"
                onClick={() => handleSubmit(false)}
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>

              <button
                type="button"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleSubmit(true)}
                disabled={loading || images.length < 2}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? "Publishing..." : "Publish Auction"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateAuction;