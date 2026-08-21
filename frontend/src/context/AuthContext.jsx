import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { loginUser } from "../services/authService";

const AuthContext = createContext(null);

const getTokenExpirationTime = (token) => {
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        if (!payload.exp) {
            return null;
        }

        return payload.exp * 1000;
    } catch (error) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const login = async (email, password) => {

        const receivedToken =
            await loginUser(email, password);

        localStorage.setItem(
            "token",
            receivedToken
        );

        setToken(receivedToken);

        return receivedToken;
    };


    /*
     * Automatically logout when JWT expires.
     */
    useEffect(() => {

        if (!token) {
            return;
        }

        const expirationTime =
            getTokenExpirationTime(token);

        if (!expirationTime) {
            console.warn(
                "Unable to determine token expiration."
            );

            return;
        }

        const remainingTime =
            expirationTime - Date.now();


        // Token has already expired
        if (remainingTime <= 0) {
            logout();
            return;
        }


        // Schedule logout exactly when token expires
        const timeoutId = setTimeout(() => {

            logout();

        }, remainingTime);


        return () => {
            clearTimeout(timeoutId);
        };

    }, [token]);


    /*
     * Handle authentication expiry
     * triggered by Axios.
     */
    useEffect(() => {

        const handleAuthExpired = () => {
            logout();
        };

        window.addEventListener(
            "auth-expired",
            handleAuthExpired
        );

        return () => {

            window.removeEventListener(
                "auth-expired",
                handleAuthExpired
            );

        };

    }, []);


    const value = {
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};