import { Route, Routes } from 'react-router-dom'
import { useGlobalContext } from './context'
import Home from './pages/Home'
import ShowNavBar from './components/ShowNavBar'
import NavBar from './components/NavBar'
import Products from './pages/Products'
import Product from './pages/Product'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Account from './pages/Account'
import UpdateProduct from './pages/UpdateProduct'
import AddProduct from './pages/AddProduct'


function App() {
  const { searchData, setSearchData, gameId, setGameId, userData, setUserData } = useGlobalContext();

  return (
    <>
      <ShowNavBar>
        <NavBar searchData={searchData} setSearchData={setSearchData} userData={userData} setUserData={setUserData} />
      </ShowNavBar>
      <Routes>
        <Route path="/" element={<Home setGameId={setGameId} gameId={gameId} />} />
        <Route path="/Products/:category" element={<Products setGameId={setGameId} />} />
        <Route path="/search" element={<Products searchData={searchData} setGameId={setGameId} />} />
        <Route path="/product/:gameId" element={<Product />} />
        <Route path="/login" element={<Login setUserData={setUserData} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register setUserData={setUserData} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/update/:gameId" element={<UpdateProduct />} />
        <Route path="/addProduct" element={<AddProduct />} />
      </Routes>

    </>
  )
}

export default App
