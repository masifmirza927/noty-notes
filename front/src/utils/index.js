

// get token from localStorage
export const getToken = () => {
    const token = localStorage.getItem("accessToken");
    if(token) {
        return token
    }
    return null;
}

// remove token from localStorage
export const removeToken  = () => {
    const token = localStorage.getItem("accessToken");
    if(token) {
        localStorage.removeItem("accessToken");
    }
    return null;
}