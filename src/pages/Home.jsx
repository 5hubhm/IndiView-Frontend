import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiThumbsUp, FiClock, FiFolder, FiUsers, FiSettings, FiHelpCircle } from "react-icons/fi";
import { BsPlayCircle } from "react-icons/bs";
import logo from "../assets/logo.jpg";

const Home = () => {
  return (
    <div className="flex h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="w-1/5 border-r border-gray-700 p-4">
        <div className="flex items-center mb-6">
          <span className="text-lg font-bold text-purple-400">PLAY</span>
        </div>
        <nav className="space-y-2">
          <SidebarButton icon={<FiHome />} text="Home" />
          <SidebarButton icon={<FiThumbsUp />} text="Liked Videos" />
          <SidebarButton icon={<FiClock />} text="History" />
          <SidebarButton icon={<FiFolder />} text="My Content" />
          <SidebarButton icon={<FiFolder />} text="Collections" />
          <SidebarButton icon={<FiUsers />} text="Subscribers" />
          <div className="border-t border-gray-700 mt-4 pt-2"></div>
          <SidebarButton icon={<FiHelpCircle />} text="Support" />
          <SidebarButton icon={<FiSettings />} text="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <BsPlayCircle className="text-purple-400 text-6xl" />
        <h2 className="mt-4 text-lg font-semibold">No videos available</h2>
        <p className="text-gray-400">There are no videos here available. Please try to search something else.</p>
      </main>

      {/* Top Bar */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-black">
        {/* Logo and Search Bar */}
        <div className="flex items-center space-x-3">
          <Link to="/Home">  {/* 👈 Wrap the logo inside Link */}
            <img src={logo} alt="IndiView Logo" className="w-12 h-12 cursor-pointer" />
          </Link>
          <input type="text" placeholder="Search" className="bg-gray-800 text-white px-4 py-2 rounded w-80" />
        </div>
        
        {/* Login/Signup Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-400 hover:text-white">Log in</Link>
          <Link to="/signup" className="bg-purple-500 px-4 py-2 rounded text-white">Sign up</Link>
        </div>
      </header>
    </div>
  );
};

const SidebarButton = ({ icon, text }) => (
  <button className="flex items-center space-x-3 w-full px-4 py-2 rounded hover:bg-gray-800">
    {icon}
    <span>{text}</span>
  </button>
);

export default Home;
