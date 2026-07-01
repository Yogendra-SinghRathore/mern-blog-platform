import axios from "axios";

// Vite uses import.meta.env to access environment variables.
// If VITE_API_BASE_URL isn't set, it cleanly falls back to localhost for local development.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Keeps track of an in-flight refresh call so multiple 401s
// firing at once don't each trigger their own refresh request.
let refreshPromise = null;

const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(
                `${BASE_URL}/auth/refresh-token`,
                {},
                { withCredentials: true }
            )
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute =
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/register") ||
            originalRequest?.url?.includes("/auth/refresh-token");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthRoute
        ) {
            originalRequest._retry = true;

            try {
                await refreshAccessToken();
                return API(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;