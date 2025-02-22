import React from "react";
import { Link } from "react-router-dom";
import { BsPlayCircle } from "react-icons/bs";
import logo from "../assets/logo.jpg";

const HomePage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation Bar */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-black">
        {/* Logo and Search Bar */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <img src={logo} alt="App Logo" className="w-12 h-12" />
          </Link>
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white px-4 py-2 rounded w-80"
          />
        </div>
        {/* Login/Signup Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-400 hover:text-white">
            Log in
          </Link>
          <Link to="/signup" className="bg-purple-500 px-4 py-2 rounded text-white">
            Sign up
          </Link>
        </div>
      </header>

      {/* Sample Video Grid */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-semibold">Trending Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((video) => (
            <div key={video} className="bg-gray-900 p-4 rounded-lg">
              <div className="bg-gray-700 h-40 flex items-center justify-center rounded-lg">
                <BsPlayCircle className="text-5xl text-white" />
              </div>
              <h3 className="text-lg font-medium mt-3">Sample Video {video}</h3>
              <p className="text-gray-400 text-sm">Some description here</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
