import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // Single field for both email & username
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before request

    try {
      await api.post(
        `/api/v1/users/login`,
        {
          identifier: formData.identifier, // Ensure we send "identifier"
          password: formData.password,
        },
        { withCredentials: true }
      );
      navigate("/"); // Redirect on successful login
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="identifier"
          placeholder="Username or Email"
          value={formData.identifier}
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
