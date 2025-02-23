import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate(); // Hook for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before new request

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/login`,
        formData,
        { withCredentials: true } // Ensures cookies are sent and received properly
      );
      // Redirect to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username || formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-800 rounded text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-800 rounded text-white"
        />

        <button type="submit" className="w-full bg-purple-500 p-2 rounded text-white font-bold hover:bg-purple-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
