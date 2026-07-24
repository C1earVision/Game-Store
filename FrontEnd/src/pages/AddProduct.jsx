import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    desc: '',
    rating: '',
    price: '',
    sq: '',
    categoryId: '',
    platform: '',
    releaseDate: ''
  });
  const [images, setImages] = useState([]); // to store selected images
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Add image files (shared by all input methods)
  const addImages = useCallback((files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    setImages(prev => {
      const combined = [...prev, ...imageFiles];
      return combined.slice(0, 3); // max 3 images
    });
  }, []);

  // Handle file input selection
  const handleImageChange = (e) => {
    addImages(e.target.files);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  };

  // Handle paste
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        pastedFiles.push(item.getAsFile());
      }
    }
    if (pastedFiles.length > 0) {
      addImages(pastedFiles);
    }
  };

  // Remove a single image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append all text fields to FormData (excluding images)
    for (const [key, value] of Object.entries(formData)) {
      formDataToSend.append(key, value);
    }

    // Append image files to FormData
    images.forEach((image) => {
      formDataToSend.append("imgs", image);  // 'imgs' can be accessed on the backend as an array of files
    });

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "https://game-store-zo3k.vercel.app/api/v1/user/admin",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",  // Ensure Content-Type is multipart/form-data
            Authorization: `Bearer ${user.token}`,
          }
        }
      );

      // Handle success, redirect to product listing page
      navigate("/");  // Redirect to product listing page
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold  mb-6 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className=" font-medium mb-2">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Brand */}
          <div className="flex flex-col">
            <label htmlFor="brand" className=" font-medium mb-2">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="desc" className=" font-medium mb-2">Description</label>
            <textarea
              id="desc"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col">
            <label htmlFor="rating" className=" font-medium mb-2">Rating (0 to 5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label htmlFor="price" className=" font-medium mb-2">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Stock Quantity */}
          <div className="flex flex-col">
            <label htmlFor="sq" className=" font-medium mb-2">Stock Quantity</label>
            <input
              type="number"
              id="sq"
              name="sq"
              value={formData.sq}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Category ID */}
          <div className="flex flex-col">
            <label htmlFor="categoryId" className=" font-medium mb-2">Category ID</label>
            <input
              type="text"
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Platform */}
          <div className="flex flex-col">
            <label htmlFor="platform" className=" font-medium mb-2">Platform</label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            >
              <option value="" disabled>Select a platform</option>
              <option value="PC">PC</option>
              <option value="PlayStation 5">PlayStation 5</option>
              <option value="PlayStation 4">PlayStation 4</option>
              <option value="PlayStation 3">PlayStation 3</option>
              <option value="Switch">Switch</option>
            </select>
          </div>

          {/* Release Date */}
          <div className="flex flex-col">
            <label htmlFor="releaseDate" className=" font-medium mb-2">Release Date</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>

          {/* Image Upload - Drag & Drop / Paste / Click */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">Upload Images (1 to 3)</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onPaste={handlePaste}
              onClick={() => fileInputRef.current?.click()}
              tabIndex={0}
              className={`p-6 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors ${
                isDragging
                  ? 'border-teal-400 bg-teal-400/10'
                  : 'border-gray-500 bg-gray-700 hover:border-gray-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="imgs"
                name="imgs"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
              </svg>
              <p className="text-gray-400">Drag & drop images here, click to browse, or <span className="text-teal-400">paste</span> from clipboard</p>
              <p className="text-sm text-gray-500 mt-1">{images.length}/3 images selected</p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="flex gap-3 mt-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600  rounded-lg focus:outline-none "
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AddProduct;
