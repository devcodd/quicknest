import axios from "axios";

const api = axios.create({
  baseURL: "https://quicknest-eight.vercel.app/api",
  timeout: 15000,
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);

      // Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("accessToken");

        // window.location.href = "/login";
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
