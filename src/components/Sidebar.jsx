import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiThumbsUp, FiClock, FiFolder, FiUsers, FiSettings, FiHelpCircle } from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  const menuItems = [
    { icon: <FiHome />, text: "Home", path: "/" },
    { icon: <FiThumbsUp />, text: "Liked Videos", path: "/likedvideos" },
    { icon: <FiClock />, text: "History", path: "/history" },
    { icon: <FiFolder />, text: "My Content", path: "/mycontent" },
    { icon: <FiFolder />, text: "Collections", path: "/collections" },
    { icon: <FiUsers />, text: "Subscription", path: "/subscription" },
    { icon: <FiHelpCircle />, text: "Support", path: "/support" },
    { icon: <FiSettings />, text: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-1/5 h-screen bg-black text-white p-4 border-r border-gray-700">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <SidebarButton
            key={item.text}
            icon={item.icon}
            text={item.text}
            path={item.path}
            isActive={location.pathname === item.path} // ✅ Check if current route matches
            navigate={navigate}
          />
        ))}
      </nav>
    </aside>
  );
};

const SidebarButton = ({ icon, text, path, isActive, navigate }) => {
  return (
    <button
      className={`flex items-center space-x-3 w-full px-4 py-2 rounded transition ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800"
      }`}
      onClick={() => navigate(path)}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Sidebar;
