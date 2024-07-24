import { useContext, createContext, useState, useEffect } from "react";


const AuthContext = createContext({
    isAuthenticated: false,
    setUser: () => {},
})


const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(true);

    function setUser() {
        setIsAuthenticated(true);
    }

    return <AuthContext.Provider value={{ isAuthenticated,  setUser}} >
        {children}
    </AuthContext.Provider>

}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }