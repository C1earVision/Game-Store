import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { gameId: id } = useParams();
  const [fieldValues, setFieldValues] = useState({
    Name: "",
    Brand: "",
    Description: "",
    Rating: "",
    Price: "",
    StockQuantity: "",
    CategoryId: "", 
    Platform: "",
    Images: ["", "", ""],
  });

  const categories = ["Action", "Adventure", "RPG", "Fantasy", "Horror"];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/products/${id}`);
        const product = response.data.game[0];
        setFieldValues({
          Name: product.Name || "",
          Brand: product.Brand || "",
          Description: product.Description || "",
          Rating: product.Rating || "",
          Price: product.Price || "",
          StockQuantity: product.StockQuantity || "",
          CategoryId: product.CategoryName || "",
          Platform: product.Platform || "",
          Images: product.Images || ["", "", ""],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e, field) => {
    setFieldValues({ ...fieldValues, [field]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e, index) => {
    const newImages = [...fieldValues.Images];
    newImages[index] = e.target.files[0]; // Store the selected file
    setFieldValues({ ...fieldValues, Images: newImages });
  };

// Update individual fields (including images)
const handleUpdate = async (field, index) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const updateImg = new FormData();  // Use FormData to handle file uploads
  const updateData = {};  // Use this for non-image fields

  // Check if the field is "Images" and the specific image at index is valid
  if (field === "Images" && fieldValues.Images[index]) {
    const image = fieldValues.Images[index];
    if (image instanceof File) {
      // If it's a valid File object, append it to FormData
      updateImg.append(`image${index}`, image);
    } else {
      console.error(`Invalid image at index ${index}`);
      alert(`Invalid image at index ${index}. Please try again.`);
      return; // Exit the function if the image is invalid
    }
  } else {
    // If it's not "Images", just append the field's value to updateData
    updateData[field] = fieldValues[field];
  }

  try {
    await axios.patch(
      `http://localhost:3000/api/v1/user/admin/${id}`,
      field === 'Images' ? updateImg : updateData, 
      {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': field === 'Images' ? 'multipart/form-data' : 'application/json',
        },
      }
    );

    alert(`${field} updated successfully!`);
  } catch (error) {
    console.error(`Error updating ${field}:`, error);
    alert(`Failed to update ${field}.`);
  }
};



  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Update Product</h2>

        {/* Name */}
        <div className="mb-6">
          <label className="block mb-2">Name:</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={fieldValues.Name}
              onChange={(e) => handleChange(e, "Name")}
              className="flex-1 p-2 bg-gray-700 rounded"
            />
            <button
              onClick={() => handleUpdate("Name")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label className="block mb-2">Brand:</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={fieldValues.Brand}
              onChange={(e) => handleChange(e, "Brand")}
              className="flex-1 p-2 bg-gray-700 rounded"
            />
            <button
              onClick={() => handleUpdate("Brand")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block mb-2">Images (1-3):</label>
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="flex-1 bg-gray-700 rounded p-2"
              />
              <button
                onClick={() => handleUpdate("Images", index)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
              >
                Update Image {index + 1}
              </button>
            </div>
          ))}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block mb-2">Category:</label>
          <div className="flex gap-4">
            <select
              value={fieldValues.CategoryId}
              onChange={(e) => handleChange(e, "CategoryId")}
              className="flex-1 p-2 bg-gray-700 rounded"
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleUpdate("CategoryId")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>

        {/* Other Fields */}
        {["Description", "Rating", "Price", "StockQuantity", "Platform"].map((field) => (
          <div className="mb-6" key={field}>
            <label className="block mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={fieldValues[field]}
                onChange={(e) => handleChange(e, field)}
                className="flex-1 p-2 bg-gray-700 rounded"
              />
              <button
                onClick={() => handleUpdate(field)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdateProduct;
