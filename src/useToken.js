import { useState } from "react";

export default function useToken(){
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        return tokenString;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token',JSON.stringify(userToken));
        // console.log("userToken: " + userToken);
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token
    };
}