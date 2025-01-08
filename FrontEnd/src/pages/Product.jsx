import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Product = () => {
  const [data, setData] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { gameId } = useParams();
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const url = `http://localhost:3000/api/v1/products/${gameId}`;
      const response = await axios.get(url);
      setData(response.data.game[0]);
      if (response.data.game[0]?.Images?.length > 0) {
        setCurrentImage(response.data.game[0].Images[0]);
      }
    };
    getData();
  }, [gameId]);

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const url = `http://localhost:3000/api/v1/user/cart/${gameId}`;
    if (!user) {
      alert("Please Log In");
      return;
    }
    try {
      await axios.post(
        url,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Game added to Cart");
    } catch (error) {
      alert("Game already in Cart");
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {/* Main Image */}
          <div className="relative mb-6">
            <img
              src={currentImage}
              alt="Product"
              className="w-full max-h-[500px] rounded-lg shadow-lg object-cover"
            />
          </div>
          {/* Thumbnail Carousel */}
          <div className="flex gap-4 overflow-x-auto">
            {data.Images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md shadow-md cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setCurrentImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between">
          {/* Product Info */}
          <div>
            <h2 className="text-3xl font-bold mb-4">{data.Name}</h2>
            <p className="text-green-500 text-3xl font-semibold mb-6">${data.Price}</p>
            <h3 className="text-xl font-semibold mb-3">Product Information</h3>
            <ul className="text-sm space-y-2">
              <li>
                <strong>Condition:</strong> New
              </li>
              <li>
                <strong>Studio:</strong> {data?.Brand}
              </li>
              <li>
                <strong>Genre:</strong> {data?.CategoryName}
              </li>
              <li>
                <strong>Release Date:</strong> {data?.ReleaseDate?.split("T")[0]}
              </li>
              <li>
                <strong>Age Rating:</strong> Adults Only 18+
              </li>
              <li>
                <strong>Platform:</strong> {data.Platform}
              </li>
              <li>
                <strong>Description:</strong> {data?.Description}
              </li>
            </ul>
          </div>
          {/* Add to Cart Section */}
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="text-white mr-3">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 rounded-md text-black"
              />
            </div>
            <button
              onClick={addToCart}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg w-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
