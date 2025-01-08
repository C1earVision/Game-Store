import React, { useState } from "react";
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
  const navigate = useNavigate();

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages); // Save selected images
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
        "http://localhost:3000/api/v1/user/admin", 
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
            <input
              type="text"
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
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

          {/* Image Upload */}
          <div className="flex flex-col">
            <label htmlFor="imgs" className=" font-medium mb-2">Upload Images (1 to 3)</label>
            <input
              type="file"
              id="imgs"
              name="imgs"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="p-3 border bg-gray-700 border-gray-300 rounded-lg focus:outline-none "
              required
            />
            <p className="text-sm text-gray-500 mt-2">You can upload up to 3 images.</p>
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
