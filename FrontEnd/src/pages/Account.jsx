import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



const Default = ({setPage})=>{
  return(
    <div className="w-3/4 p-8">
      <h2 className="text-white text-lg font-bold mb-4">Welcome Ahmed Ebrahim</h2>
      <p className="text-white text-sm mb-4">What would you like to do?</p>

      <div className="grid grid-cols-2 gap-4">
        <div onClick={()=>setPage('orders')} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Orders</h3>
          <p className="text-white text-sm">Manage your orders.</p>
        </div>
        <div onClick={()=>setPage('personalInfo')} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Personal Information</h3>
          <p className="text-white text-sm">Edit your personal information.</p>
        </div>
        <div onClick={()=>setPage('shipping')} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Shipping</h3>
          <p className="text-white text-sm">Edit your delivery addresses.</p>
        </div>
        <Link to={'/cart'} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Cart</h3>
          <p className="text-white text-sm">Manage your Cart.</p>
        </Link>
      </div>
    </div>
  )
}

const Orders = ()=>{
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const url = `http://localhost:3000/api/v1/user/order`;
  
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    getOrders();
  }, []);
  
  return(
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-2xl font-bold mb-2">Orders History</h2>
        <p className="text-gray-400 mb-6">View your orders history</p>

        {orders.length > 0 ? (
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]"> {/* Added max height and vertical overflow */}
            <table className="table-auto w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr className="text-gray-400 bg-gray-700">
                  <th className="p-3 border border-gray-700">Order Date</th>
                  <th className="p-3 border border-gray-700">Products</th>
                  <th className="p-3 border border-gray-700">Product Price</th>
                  <th className="p-3 border border-gray-700">Quantity</th>
                  <th className="p-3 border border-gray-700">Order Status</th>
                  <th className="p-3 border border-gray-700">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={`transition-all ${
                      order.Status === "DELIVERED"
                        ? "bg-gray-700 text-gray-400"
                        : "hover:bg-gray-700 text-white"
                    }`}
                  >
                    <td className="p-3 border border-gray-700">{order.OrderDate}</td>
                    <td className="p-3 border border-gray-700">
                      {order.Products.map((product, i) => (
                        <div key={i}>{product.ProductName}</div>
                      ))}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {order.Products.map((product, i) => (
                        <div key={i}>{product.ProductPrice}</div>
                      ))}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {order.Products.map((product, i) => (
                        <div key={i}>{product.Quantity}</div>
                      ))}
                    </td>
                    <td className="p-3 border border-gray-700">{order.Status}</td>
                    <td className="p-3 border border-gray-700">
                      ${order.TotalOrderPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-400 text-center p-4">
            You Didn't Place Any Orders Yet
          </div>
        )}
      </div>
    </div>

  
  )
}


const PersonalInformation = ()=>{
  const [user, setUser] = useState([]);
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user.user)
  },[])
  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
        {/* Header */}
        <h2 className="text-white text-2xl font-bold mb-6">Personal Information</h2>

        {/* Grid layout for 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name Field - Spanning across both columns */}
          <div className="col-span-2">
            <label className="text-gray-400 block mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={user.Name}
              className="w-full bg-gray-700 text-gray-300 rounded p-2 focus:outline-none"
              disabled
            />
          </div>

          {/* Phone Numbers Field - Spanning across the row */}
          <div className="col-span-2">
            <label className="text-gray-400 block mb-1">Mobile</label>
            <div className="flex space-x-4">
              {user.PhoneNumbers?.map((number, index) => (
                <div key={index} className="w-1/2">
                  <input
                    type="text"
                    value={number}
                    className="w-full bg-gray-700 text-gray-300 rounded p-2 focus:outline-none mb-2"
                    disabled
                  />
                  <span className="text-teal-400 text-sm">Mobile is verified</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="text-gray-400 block mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={user.Email}
              className="w-full bg-gray-700 text-gray-300 rounded p-2 focus:outline-none"
              disabled
            />
            <span className="text-teal-400 text-sm mt-1 block">Email is verified</span>
          </div>

        </div>
      </div>
    </div>
  )
}

const ShippingInformation = ()=>{


  const [user, setUser] = useState({});

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user.user)
  },[])


  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-2xl font-bold mb-2">Address Information</h2>
        <p className="text-gray-400 mb-6">Manage your address details</p>

        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div className="w-full">
              <label className="text-gray-400">Country</label>
              <input
                type="text"
                name="Country"
                value={user.Country}
                className="w-full bg-gray-700 text-gray-300 rounded p-2 focus:outline-none mb-2"
                disabled
              />
            </div>

            {/* City */}
            <div className="w-full">
              <label className="text-gray-400">City</label>
              <input
                type="text"
                name="City"
                value={user.City}
                className="w-full bg-gray-700 text-gray-300 rounded p-2 focus:outline-none mb-2"
                disabled
              />
            </div>

            {/* State */}
            <div className="w-full">
              <label className="text-gray-400">State</label>
              <input
                type="text"
                name="State"
                value={user.State}
                className="w-full bg-gray-700 text-gray-300 rounded p-2 focus:outline-none mb-2"
                disabled
              />
            </div>

            {/* Street */}
            <div className="w-full sm:col-span-2">
              <label className="text-gray-400">Street</label>
              <input
                type="text"
                name="Street"
                value={user.Street}
                className="w-full bg-gray-700 text-gray-300 rounded p-2 focus:outline-none mb-2"
                disabled
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


const DefaultAdmin = ({setPageAdmin})=>{
  return(
    <div className="w-3/4 p-8">
      <h2 className="text-white text-lg font-bold mb-4">Welcome Ahmed Ebrahim</h2>
      <p className="text-white text-sm mb-4">What would you like to do?</p>

      <div className="grid grid-cols-2 gap-4">
        <div onClick={()=>setPageAdmin('AdminOrders')} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Orders</h3>
          <p className="text-white text-sm">See Requested orders.</p>
        </div>
        <div onClick={()=>setPageAdmin('AdminProducts')} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Products</h3>
          <p className="text-white text-sm">Manage Products.</p>
        </div>
        <div onClick={()=>setPageAdmin('personalInfo')} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Personal Information</h3>
          <p className="text-white text-sm">See your personal information.</p>
        </div>
        <div onClick={()=>setPageAdmin('shipping')} className="bg-gray-800 p-4 cursor-pointer rounded-lg transform transition-all duration-300 hover:bg-gray-700">
          <h3 className="text-white text-md font-bold mb-2">Address</h3>
          <p className="text-white text-sm">See your address.</p>
        </div>
      </div>
    </div>
  );
}


const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState([]);

  const getOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const url = `http://localhost:3000/api/v1/user/order`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setOrders(response.data.groupedOrders);
      setAddress(response.data.addresses)
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const url = `http://localhost:3000/api/v1/user/order`;

    await axios.patch(url,{
      orderId,
    }, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    getOrders()
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-2xl font-bold mb-2">Order Requests</h2>
        <p className="text-gray-400 mb-6">Manage Requested Orders</p>

        {orders.length > 0 ? (
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]"> {/* Added max height and vertical overflow */}
            <table className="table-auto w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr className="text-gray-400 bg-gray-700">
                  <th className="p-3 border border-gray-700">Order Date</th>
                  <th className="p-3 border border-gray-700">Customer ID</th>
                  <th className="p-3 border border-gray-700">Products</th>
                  <th className="p-3 border border-gray-700">Product Price</th>
                  <th className="p-3 border border-gray-700">Quantity</th>
                  <th className="p-3 border border-gray-700">Order Status</th>
                  <th className="p-3 border border-gray-700">Location</th>
                  <th className="p-3 border border-gray-700">Total Price</th>
                  <th className="p-3 border border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={`transition-all ${
                      order.Status === "DELIVERED"
                        ? "bg-gray-700 text-gray-400"
                        : "hover:bg-gray-700 text-white"
                    }`}
                  >
                    <td className="p-3 border border-gray-700">{order.OrderDate}</td>
                    <td className="p-3 border border-gray-700">{order.CustomerId}</td>
                    <td className="p-3 border border-gray-700">
                      {order.Products.map((product, i) => (
                        <div key={i}>{product.ProductName}</div>
                      ))}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {order.Products.map((product, i) => (
                        <div key={i}>{product.ProductPrice}</div>
                      ))}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {order.Products.map((product, i) => (
                        <div key={i}>{product.Quantity}</div>
                      ))}
                    </td>
                    <td className="p-3 border border-gray-700">{order.Status}</td>
                    <td className="p-3 border border-gray-700">
                      {address[index].Country}, {address[index].City}, {address[index].Street}
                    </td>
                    <td className="p-3 border border-gray-700">
                      ${order.TotalOrderPrice}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {order.Status !== "DELIVERED" ? (
                        <button
                          onClick={() => handleDeliver(order.OrderId)}
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded"
                        >
                          Deliver
                        </button>
                      ) : (
                        <span className="text-gray-400">Delivered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-400 text-center p-4">
            You Didn't Place Any Orders Yet
          </div>
        )}
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/products");
      setProducts(response.data.games);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  const handleSearch = async (value) =>{
    setSearchTerm(value)
    const url = `http://localhost:3000/api/v1/products?Name=${value}`
    const response = await axios.get(url);
    setProducts(response.data.games);
  }

  const handleDelete = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.delete(`http://localhost:3000/api/v1/user/admin/${productId}`,{
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      getProducts()
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };


  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-2xl font-bold mb-4">Product Management</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className="w-2/3 p-2 rounded bg-gray-700 text-gray-300 focus:outline-none"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Link
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
            to={'/addProduct'}
          >
            Add Product
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="overflow-y-auto max-h-[500px]"> {/* Enable vertical scrolling */}
            <table className="table-auto w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr className="text-gray-400 bg-gray-700">
                  <th className="p-2 border border-gray-700">Product ID</th>
                  <th className="p-2 border border-gray-700">Name</th>
                  <th className="p-2 border border-gray-700">Price</th>
                  <th className="p-2 border border-gray-700">Category</th>
                  <th className="p-2 border border-gray-700">Studio</th>
                  <th className="p-2 border border-gray-700">Platform</th>
                  <th className="p-2 border border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.ProductId}
                    className="text-white hover:bg-gray-700 transition-all"
                  >
                    <td className="p-2 border border-gray-700">{product.ProductId}</td>
                    <td className="p-2 border border-gray-700">{product.Name}</td>
                    <td className="p-2 border border-gray-700">${product.Price}</td>
                    <td className="p-2 border border-gray-700">{product.CategoryName}</td>
                    <td className="p-2 border border-gray-700">{product.Brand}</td>
                    <td className="p-2 border border-gray-700">{product.Platform}</td>
                    <td className="p-2 border border-gray-700 flex gap-2">
                      <Link to={`/update/${product.ProductId}`}>
                        <i className="fa-solid fa-pen-to-square px-3 py-3 cursor-pointer"></i>
                      </Link>
                      <i
                        onClick={() => handleDelete(product.ProductId)}
                        className="fa-sharp-duotone fa-solid fa-trash cursor-pointer px-3 py-3"
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-400 text-center p-4">No products found.</div>
        )}
      </div>
    </div>


  );
};


const Account = ({ }) => {
  const [page, setPage] = useState('default');
  const [pageAdmin, setPageAdmin] = useState('default');  
  const [user, setUser] = useState('default');
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user.user)
  },[])

  const renderPage = () => {
    switch (page) {
      case 'orders':
        return <Orders />;
      case 'personalInfo':
        return <PersonalInformation />;
      case 'shipping':
        return <ShippingInformation />;
      default:
        return <Default setPage={setPage} />;
    }
  };

  const renderPageAdmin = () => {
    switch (pageAdmin) {
      case 'AdminOrders':
        return <OrdersAdmin />;
      case 'AdminProducts':
        return <AdminProducts />
      case 'personalInfo':
        return <PersonalInformation />;
      case 'shipping':
        return <ShippingInformation />;
      default:
        return <DefaultAdmin setPageAdmin={setPageAdmin} />;
    }
  };


  return (
    <>
      {user.AdminState === 0? 
      <div className="bg-gray-900 h-screen flex">
      <div className="w-1/4 bg-gray-800 p-4">
        <h2 className="text-white text-lg font-bold mb-4">Manage Your Account</h2>
        <div className="flex flex-col gap-2">
          <div onClick={()=>setPage('default')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
            <span to={'/account'}>My Account</span>
          </div>
          <div onClick={()=>setPage('orders')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
            <span>Orders</span>
          </div>
          <div onClick={()=>setPage('personalInfo')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
            <span>Personal Information</span>
          </div>
          <div onClick={()=>setPage('shipping')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
            <span>Shipping Information</span>
          </div>
          <div className="text-white text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
            <Link to={'/cart'}>Cart</Link>
          </div>
        </div>
      </div>
      {renderPage()}
    </div>:
    <div className="bg-gray-900 h-screen flex">
    <div className="w-1/4 bg-gray-800 p-4">
      <h2 className="text-white text-lg font-bold mb-4">Manage Your Account</h2>
      <div className="flex flex-col gap-2">
        <div onClick={()=>setPageAdmin('default')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
          <span to={'/account'}>My Account</span>
        </div>
        <div onClick={()=>setPageAdmin('AdminOrders')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
          <span>Orders</span>
        </div>
        <div onClick={()=>setPageAdmin('AdminProducts')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
          <span>Products</span>
        </div>
        <div onClick={()=>setPageAdmin('personalInfo')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
          <span>Personal Information</span>
        </div>
        <div onClick={()=>setPageAdmin('shipping')} className="text-white cursor-pointer text-sm mb-2 hover:text-blue-400 transition-colors duration-200">
          <span>Admin Address</span>
        </div>
      </div>
    </div>
    {renderPageAdmin()}
  </div>}
      
    </>
  );
}

export default Account;
