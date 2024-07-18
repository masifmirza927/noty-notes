import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils";


// create a context
export const AuthContext = createContext(null);

// constext provider
export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);

    const navigate = useNavigate();

    // login call
    const loginUser = async (credentials) => {
        setLoading(true);
        const res = await axios.post("http://localhost:3001/user/login", credentials);
        if (res.data.errors == true) {
            setError(res.data.message);
        } else if (res.data.errors == false) {
            setIsLogin(true);
            // saving access token to local storeage to keep the user logged in
            localStorage.setItem("accessToken", res.data.accessToken);
            navigate('/');

            console.log(res.data);
        }

        setLoading(false);
    }


    // get all notes
    const getUserNotes = async () => {
        const token = getToken();
        if (token) {
            const res = await axios.get("http://localhost:3001/notes/me", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(res.data.errors == true) {
                setError(res.data.message)
            } else {
                setNotes(res.data.notes);
            }

            console.log(res);

        } else {
            navigate('/login');
        }

    }


    // logout user
    const logout = async () => {
        localStorage.removeItem("accessToken");
        setIsLogin(false);
        navigate("/login");
    }


    return <AuthContext.Provider value={{ isLogin, setIsLogin, loading, loginUser, error, getUserNotes, notes, logout }}>
        {children}
    </AuthContext.Provider>

}