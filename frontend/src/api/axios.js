import axios from "axios";

// Read API URL from environment variables, fallback to local development URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/spms";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { BACKEND_URL };
export default api;