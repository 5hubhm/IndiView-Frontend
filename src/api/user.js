import api from "../utils/api";

export const getUserChannelProfile = async (username) => {
  try {
    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/c/${username}`);
    return response.data; // Returning fetched channel data
  } catch (error) {
    console.error("Error fetching channel profile:", error);
    throw error;
  }
};
