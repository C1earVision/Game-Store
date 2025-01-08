import React, { useState, useEffect } from 'react';
import axios from "axios";


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState([]);

  const removeItem = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const url = `http://localhost:3000/api/v1/user/cart/${id}`;
    await axios.patch(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setCartItems((prevItems) => prevItems.filter((item) => item.ProductId !== id));
  };

  const placeOrder = async ()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    const url = `http://localhost:3000/api/v1/user/order`;
    await axios.post(
      url,
      {
        cartItems,
        total: cartTotal
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    cartItems.map((item)=>{
      removeItem(item.ProductId)
    })
    setCartItems([]);
  }

  
  useEffect(() => {
    const total = cartItems.reduce(
      (total, item) => total + item.Price * item.Quantity,
      0
    );
    setCartTotal(total)
  }, [cartItems]) 
  
  useEffect(() => {
    const getData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const url = `http://localhost:3000/api/v1/user/cart`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCartItems(response.data.games)
    }

    getData()
  }, []) 

  return (
    <div className="min-h-screen px-8 py-10">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Your Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="col-span-2 overflow-y-auto"
              style={{ maxHeight: '400px' }} // Adjust maxHeight as needed
            >
              {cartItems.map((item) => (
                <div
                  key={item.ProductId}
                  className="grid grid-cols-3 items-center border-b py-4 gap-4"
                >
                  {/* Product Info */}
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="font-medium text-lg text-gray-700">{item.Name}</h2>
                      <p className="text-gray-500">${item.Price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-center">
                    <span className="text-lg font-semibold">{item.Quantity}</span>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-end space-x-4">
                    <p className="text-lg font-medium text-gray-700">
                      ${(item.Price * item.Quantity).toFixed(2)}
                    </p>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => removeItem(item.ProductId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between text-gray-700 mb-2">
                <p>Subtotal</p>
                <p>${cartTotal}</p>
              </div>
              <div className="flex justify-between text-gray-700 mb-4">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <p>Total</p>
                <p>${cartTotal}</p>
              </div>
              <button onClick={placeOrder} className="mt-6 w-full py-3 bg-[rgb(149,171,82)] text-white text-lg rounded-lg hover:bg-blue-600">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
