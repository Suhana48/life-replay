import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every protected request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle authentication failures centrally
api.interceptors.response.use(
    (response) => response,
    (error) => {
       if (
           error.response?.status === 401 ||
           error.response?.status === 403
       ) {
            localStorage.removeItem("token");

            // Let React/router handle the redirect later.
            window.dispatchEvent(new Event("auth-expired"));
        }

        return Promise.reject(error);
    }
);

export default api;