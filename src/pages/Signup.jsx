import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    avatar: null,
    avatarName: "", // New state to store file name
    coverImage: null,
    coverImageName: "", // New state to store file name
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0], 
        [`${name}Name`]: files[0].name, // Store file name in state
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("avatar", formData.avatar);
    if (formData.coverImage) {
      formDataToSend.append("coverImage", formData.coverImage);
    }
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("username", formData.username.toLowerCase());

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login"); 
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">Create an Account</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-800 rounded text-white"
        />

        {/* Avatar Input with Displayed Filename */}
        <label className="block">
          <span className="text-gray-300">Avatar</span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full p-2 bg-gray-800 rounded text-white hidden"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" className="block cursor-pointer bg-gray-700 p-2 rounded text-center">
            {formData.avatarName || "Choose File"}
          </label>
        </label>

        {/* Cover Image Input with Displayed Filename */}
        <label className="block">
          <span className="text-gray-300">Cover Image</span>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-800 rounded text-white hidden"
            id="cover-upload"
          />
          <label htmlFor="cover-upload" className="block cursor-pointer bg-gray-700 p-2 rounded text-center">
            {formData.coverImageName || "Choose File"}
          </label>
        </label>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-800 rounded text-white"
        />

        <button type="submit" className="w-full bg-purple-500 p-2 rounded text-white font-bold hover:bg-purple-600">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
