import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../images/Logo.png';

const NavBar = ({ searchData, setSearchData, userData, setUserData }) => {
  const navigate = useNavigate();
  const [searchBarData, setSearchBarData] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState('default');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user?.user)
  }, [])

  const search = () => {
    setSearchData(searchBarData);
    navigate(`/search`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserData({});
    navigate('/');
  };
  const cartOnClick = () => {
    userData.user ? navigate('/cart') : alert('log in to access cart')
  }

  return (
    <>
      <nav className="bg-[rgb(28,34,52)] shadow-lg">
        <div className="mx-auto flex justify-between items-center h-[70px] px-4 lg:px-20">
          <div className="text-xl text-white font-semibold">
            <Link to="/"><img className="w-10" src={logo} alt="Logo" /></Link>
          </div>
          <div className="flex-grow mx-4 outline-none">
            <input
              type="text"
              value={searchBarData}
              onKeyDown={(e) => (e.key === "Enter" ? search() : null)}
              onChange={(e) => setSearchBarData(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Search..."
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4 relative">
            {userData.user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-600 hover:text-white flex items-center space-x-2"
                >
                  <span>Welcome, {userData.user.user.Name}</span>
                  <i className="fa-solid fa-caret-down"></i>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg">
                    <Link
                      to={'/account'}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[rgb(149,171,82)] transition duration-200 rounded-md"
                    >
                      <i className="fa-solid fa-file-invoice"></i>
                      <span className="ml-4">Account</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-500 transition duration-200 rounded-md"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-2"></i>
                      <span className="ml-2">Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[rgb(149,171,82)] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}

            {user?.AdminState === 0 ?
              <div onClick={cartOnClick} className="text-gray-600 hover:text-gray-900">
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
              </div> : null}
          </div>
        </div>

        {/* Links */}
        <div className="">
          <div className="flex justify-center gap-5 mt-5 py-2 text-white">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/Products/PC" className="hover:text-gray-300">PC</Link>
            <Link to="/Products/PS5" className="hover:text-gray-300">PlayStation 5</Link>
            <Link to="/Products/PS4" className="hover:text-gray-300">PlayStation 4</Link>
            <Link to="/Products/PS3" className="hover:text-gray-300">PlayStation 3</Link>
            <Link to="/Products/NINTENDO SWITCH" className="hover:text-gray-300">Switch</Link>
            <Link to="/Products/AllGames" className="hover:text-gray-300">All Games</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
