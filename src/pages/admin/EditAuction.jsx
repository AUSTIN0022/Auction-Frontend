// src/pages/admin/EditAuction.jsx
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Image as ImageIcon,
    Save,
    Tag,
    Trash2,
    Upload,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { deleteAuction, getAuctionById, getAuctionCategories, updateAuction } from '../../services/adminAuctions';

export default function EditAuction() {
  const { id: auctionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    basePrice: '',
    emdAmount: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    registrationDeadline: '',
    registrationDeadlineTime: '',
    bidInterval: '60', // Default 1 minute
    status: 'draft',
    categorie: '',
  });
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [alert, setAlert] = useState(null);

  const fileInputRef = useRef(null);

  const MIN_IMAGES = 2;
  const MAX_IMAGES = 5;

  // Bid interval options
  const bidIntervalOptions = [
    { value: "30", label: "30 seconds" },
    { value: "60", label: "1 minute" },
    { value: "120", label: "2 minutes" },
    { value: "300", label: "5 minutes" },
    { value: "600", label: "10 minutes" },
    { value: "900", label: "15 minutes" },
    { value: "1800", label: "30 minutes" },
    { value: "3600", label: "1 hour" },
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  // Helper function to extract date and time from ISO string
  const extractDateTime = (isoString) => {
    if (!isoString) return { date: '', time: '' };
    const date = new Date(isoString);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().slice(0, 5);
    return { date: dateStr, time: timeStr };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, auctionRes] = await Promise.all([
          getAuctionCategories(),
          getAuctionById(auctionId),
        ]);

        setCategories(catRes.data.categories || []);

        const auction = auctionRes.data.auctionDetails;
        
        // Extract date and time components
        const startDateTime = extractDateTime(auction.startDate);
        const endDateTime = extractDateTime(auction.endDate);
        const regDateTime = extractDateTime(auction.registrationDeadline);

        setForm({
          title: auction.title,
          description: auction.description,
          basePrice: auction.basePrice,
          emdAmount: auction.emdAmount,
          startDate: startDateTime.date,
          startTime: startDateTime.time,
          endDate: endDateTime.date,
          endTime: endDateTime.time,
          registrationDeadline: regDateTime.date,
          registrationDeadlineTime: regDateTime.time,
          bidInterval: auction.bidInterval || '60',
          status: auction.status,
          categorie: auction.categorie,
        });
        setExistingImages(auction.images || []);
      } catch (err) {
        console.error(err);
        setAlert({ type: 'error', message: 'Failed to load auction data.' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [auctionId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > MAX_IMAGES) {
      return setAlert({ 
        type: 'error', 
        message: `Maximum ${MAX_IMAGES} images allowed. You currently have ${existingImages.length + newImages.length} images.` 
      });
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (url) => {
    setImagesToRemove((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateDates = () => {
    // Parse dates with IST timezone consideration
    const regDateTime = new Date(`${form.registrationDeadline}T${form.registrationDeadlineTime}:00+05:30`);
    const startDateTime = new Date(`${form.startDate}T${form.startTime}:00+05:30`);
    const endDateTime = new Date(`${form.endDate}T${form.endTime}:00+05:30`);
    const now = new Date();

    if (regDateTime <= now) {
      setAlert({ type: "error", message: "Registration deadline must be in the future" });
      return false;
    }

    if (startDateTime <= regDateTime) {
      setAlert({ type: "error", message: "Start date must be after registration deadline" });
      return false;
    }

    if (endDateTime <= startDateTime) {
      setAlert({ type: "error", message: "End date must be after start date" });
      return false;
    }

    return true;
  };

  const validateForm = () => {
    const total = existingImages.length + newImages.length;
    if (total < MIN_IMAGES) {
      setAlert({ type: 'error', message: `At least ${MIN_IMAGES} images are required.` });
      return false;
    }
    return validateDates();
  };

  // Helper function to convert date and time to ISO 8601 with IST timezone
  const formatToIST = (date, time) => {
    if (!date || !time) return null;
    // Create ISO string with IST timezone (+05:30)
    return `${date}T${time}:00+05:30`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    
    // Combine date and time into ISO 8601 format with IST timezone
    const combinedForm = {
      title: form.title,
      description: form.description,
      basePrice: form.basePrice,
      emdAmount: form.emdAmount,
      bidInterval: form.bidInterval,
      startDate: formatToIST(form.startDate, form.startTime),
      endDate: formatToIST(form.endDate, form.endTime),
      registrationDeadline: formatToIST(form.registrationDeadline, form.registrationDeadlineTime),
      status: form.status,
      categorie: form.categorie,

    };

    Object.entries(combinedForm).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });
    
    formData.append('auctionId', auctionId);
    formData.append("createdBy", user.id);
    formData.append('existingImages', JSON.stringify(existingImages));
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
    newImages.forEach((file) => formData.append('auction_images', file));

    try {
      setLoading(true);
      const res = await updateAuction(auctionId, formData);
      setAlert({ type: 'success', message: 'Auction updated successfully!' });
      setTimeout(() => navigate('/view-auctions'), 1500);
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to update auction. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuction = async () => {
    // Implement delete functionality
    if (window.confirm('Are you sure you want to delete this auction? This action cannot be undone.')) {
      // Add delete logic here
      console.log('Delete auction logic to be implemented');
      await deleteAuction(auctionId);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading auction data...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Auction</h1>
              <p className="text-gray-600">Update the auction details below</p>
            </div>
          </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
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

              {/* Bidding Settings Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Bidding Settings
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bid Interval *
                  </label>
                  <select
                    name="bidInterval"
                    value={form.bidInterval}
                    onChange={handleChange}
                    className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    {bidIntervalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    Time interval between consecutive bids during the auction
                  </p>
                </div>
              </div>

              {/* Date & Time Settings Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Date & Time Settings
                </h3>
                <div className="space-y-6">
                  
                  {/* Registration Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        name="registrationDeadline"
                        value={form.registrationDeadline}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                      <input
                        type="time"
                        name="registrationDeadlineTime"
                        value={form.registrationDeadlineTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Last date and time for bidders to register (IST)
                    </p>
                  </div>
                  
                  {/* Start Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auction Start *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                      <input
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      When the auction will begin (IST)
                    </p>
                  </div>

                  {/* End Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auction End *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                      <input
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      When the auction will end (IST)
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  Auction Status
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Image Management Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  Images ({existingImages.length + newImages.length}/5)
                </h3>
                
                {/* Current Images */}
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Current Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {existingImages.map((url, i) => (
                        <div key={i} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={url}
                              alt={`Current ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={existingImages.length + newImages.length >= MAX_IMAGES}
                      >
                        <Upload className="w-4 h-4" />
                        Add More Images
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload additional images (JPG, PNG, WebP)
                      </p>
                    </div>

                    {/* New Images Preview */}
                    {newImages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">New Images to Add</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {newImages.map((img, i) => (
                            <div key={i} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt={`New ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeNewImage(i)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {(existingImages.length + newImages.length) < MIN_IMAGES && (
                  <p className="text-sm text-red-600 mt-2">
                    * Minimum {MIN_IMAGES} images are required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 lg:px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Delete Button */}
              <button
                type="button"
                className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors inline-flex items-center justify-center gap-2"
                onClick={handleDeleteAuction}
              >
                <Trash2 className="w-4 h-4" />
                Delete Auction
              </button>

              {/* Update Button */}
              <button
                type="button"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading || (existingImages.length + newImages.length) < MIN_IMAGES}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Updating..." : "Update Auction"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}