import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext)


const AppContext = (props) => {
  const [searchData, setSearchData] = useState('')
  const [gameId, setGameId] = useState(null)
  const [userData, setUserData] = useState({ 
    user:JSON.parse(localStorage.getItem('user')),
  })
  return (
    <GlobalContext.Provider value={{ searchData, setSearchData, gameId, setGameId, userData, setUserData }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export default AppContext;