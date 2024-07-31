import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, removeToken, removeUser } from "../utils";
import { httpClient } from "../lib/httpClient";


// create a context
export const AuthContext = createContext(null);

// constext provider
export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [verifyReq, setVerifyReq] = useState(false);

    const navigate = useNavigate();

    // login call
    const loginUser = async (credentials) => {
        setLoading(true);
        const res = await httpClient.post("/user/login", credentials);
        if (res.data.errors == true) {
            setError(res.data.message);
        } else if (res.data.errors == false) {
            // saving access token to local storeage to keep the user logged in
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            setIsLogin(true);
            navigate('/');
        }

        setLoading(false);
    }


    // get all notes
    const getUserNotes = async (type = null) => {
        const token = getToken();
        let url = `/notes/me`;

        if(type !== null) {
            url += `/${type}`;
        }

        if (token) {
            const res = await httpClient.get(url);

            if (res.data.errors == true) {
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
        removeUser();
        setNotes([]);
        removeToken();
        setIsLogin(false);
        //navigate("/login");
    }



    useEffect(() => {
        const user = getUser();
        const verifyToken = async () => {
            const token = getToken();

            if (token) {
                setVerifyReq(true);
                try {
                    await httpClient.post("/user/verify", { token: token });
                    setUser(user)
                    setIsLogin(true);
                    navigate("/");
                    // Handle success (e.g., set login state)
                } catch (error) {
                    removeUser();
                    removeToken();
                    setIsLogin(false);
                    navigate("/login");
                    // Handle error (e.g., navigate to login)
                } finally {
                    setVerifyReq(false);
                }
            } else {
                setIsLogin(false);
                navigate("/login");
            }
        };

        verifyToken();
    }, []);




    return <AuthContext.Provider value={{ isLogin, setIsLogin, loading, setNotes, loginUser, error, verifyReq, getUserNotes, setUser, notes, logout, user }}>
        {children}
    </AuthContext.Provider>

}