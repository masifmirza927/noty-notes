

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

export const updateUser = (user) => {
     localStorage.setItem('user', JSON.stringify(user));

}
export const getUser = () => {
    const user = localStorage.getItem('user');
    if(user) {
        return JSON.parse(user);
    }
    return null;
}

export const removeUser = () => {
    localStorage.removeItem('user');
}