import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { loginUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const login = async (email, password) => {
        const receivedToken = await loginUser(email, password);

        localStorage.setItem("token", receivedToken);
        setToken(receivedToken);

        return receivedToken;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

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
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};