import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Category from "../components/Category";

const Products = ({ searchData, setGameId }) => {
  const location = useLocation();
  const [platform, setPlatform] = useState("");
  const [data, setData] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  useEffect(() => {
    setSortValue("")
    setCategoryValue("")
    const pathSegments = location.pathname.split("/");
    let currentPlatform = pathSegments[pathSegments.length - 1] || "DefaultPlatform"; // Fallback value
    if (currentPlatform === 'NINTENDO%20SWITCH'){
      currentPlatform = 'NINTENDO SWITCH'
    }
    setPlatform(currentPlatform);

  }, [location.pathname]);

  useEffect(() => {
    if (searchData){
      const getData = async ()=>{
        const url = `http://localhost:3000/api/v1/products?Name=${searchData}`
        const response = await axios.get(url);
        setData(response.data.games);
      }
      getData()
    }
  }, [searchData]);

  const handleSortChange = async (event) => {
    const selectedSort = event.target.value;
    setSortValue(selectedSort);
    try {
      const url = `http://localhost:3000/api/v1/products?` +
      (platform === "AllGames"
        ? categoryValue ? `CategoryId=${categoryValue}&` : ""
        : `Platform=${platform}&${categoryValue ? `CategoryId=${categoryValue}&` : ""}`) +
      (selectedSort ? `ORDER_BY=${selectedSort}` : "");


      const response = await axios.get(url);
      setData(response.data.games);
      console.log("Data fetched for Sort:", response.data.games);
    } catch (error) {
      console.error("Error fetching sorted data:", error);
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    setCategoryValue(selectedCategory);
    setSortValue('');
    try {
      const url = selectedCategory === ""
        ? `http://localhost:3000/api/v1/products?${platform === "AllGames" ? "" : `Platform=${platform}`}`
        : `http://localhost:3000/api/v1/products?${platform === "AllGames" ? "" : `Platform=${platform}&`}CategoryId=${selectedCategory}`;

      const response = await axios.get(url);
      setData(response.data.games);
      console.log("Data fetched for category:", response.data.games);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  return (
    <div className="flex flex-row items-start gap-6 p-4">
      {/* Sorting and Category Dropdown */}
      {!searchData?<div className="flex flex-col items-start mt-24 gap-4 p-4 bg-gray-100 rounded-md">
        <div className="w-full">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort
          </label>
          <select
            id="sort"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={sortValue}
            onChange={handleSortChange}
          >
            <option value="">...</option>
            <option value="Price_DESC">Price → High to Low</option>
            <option value="Price_ASC">Price → Low to High</option>
            <option value="ReleaseDate_DESC">Newest</option>
            <option value="ReleaseDate_ASC">Oldest</option>
          </select>
        </div>

        <div className="w-full">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={categoryValue}
            onChange={handleCategoryChange}
          >
            <option value="">...</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="RPG">RPG</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
          </select>
        </div>
      </div>:''}
      

      {/* Category Component */}
      <div>
        {sortValue || categoryValue || searchData ? <Category setGameId={setGameId} data={data} title={platform} /> : <Category setGameId={setGameId} sort="Platform" title={platform} />}
      </div>
    </div>
  );
};

export default Products;
