import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Attach JWT + bust browser cache on GET requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Prevent browser HTTP caching on GET requests
    if (config.method === "get") {
        config.params = { ...config.params, _t: Date.now() };
    }
    return config;
});

// Handle 401 globally – clear token and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// ── Auth endpoints ─────────────────────────────────────────
export const authAPI = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    getMe: () => api.get("/auth/me"),
};

// ── Task endpoints ─────────────────────────────────────────
export const taskAPI = {
    list: (params = {}) => api.get("/tasks", { params }),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post("/tasks", data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    remove: (id) => api.delete(`/tasks/${id}`),
};

export default api;
