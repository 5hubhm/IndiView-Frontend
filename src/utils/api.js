import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, // Update with your backend URL
  withCredentials: true, // Ensures cookies (JWT) are sent with requests
});

// Response Interceptor (Auto Refresh Token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request a new access token
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
