import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// create a context
export const AuthContext = createContext(null);

// constext provider
export const AuthProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // login call
    const loginUser = async (credentials) => {
        setLoading(true);
        const res = await axios.post("http://localhost:3001/user/login", credentials);
        if(res.data.errors == true) {
            setError(res.data.message);
        } else if(res.data.errors == false) {
            setIsLogin(true);
            navigate('/');
            console.log(res.data);
        }

        setLoading(false);
    }

    return <AuthContext.Provider value={{ isLogin, setIsLogin, loading, loginUser, error }}>
        {children}
    </AuthContext.Provider>

}