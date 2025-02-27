import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Ensures cookies (JWT) are sent with requests
});

// Response Interceptor (Auto Refresh Token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        console.log("Refreshing access token...");

        // Request a new access token using the refresh token (cookies)
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/refresh-token`,
          {},
          { withCredentials: true } // Sends the refresh token cookie
        );

        console.log("Access token refreshed successfully. Retrying request...");

        // ⚠️ Retry the original request, ensuring it includes updated cookies
        return api({
          ...originalRequest,
          headers: { ...originalRequest.headers }, // Ensure headers remain the same
          withCredentials: true, // Ensures new cookies are included
        });
      } catch (refreshError) {
        console.error("Session expired.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
