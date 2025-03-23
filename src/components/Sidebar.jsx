import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiThumbsUp, FiClock, FiFolder, FiUsers, FiSettings, FiHelpCircle } from "react-icons/fi";
import api from "../utils/api";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/v1/users/current-user", {
          withCredentials: true,
        });

        if (response.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]); // Recheck authentication when navigating

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  const menuItems = [
    { icon: <FiHome />, text: "Home", path: "/" },
    { icon: <FiThumbsUp />, text: "Liked Videos", path: "/liked", protected: true },
    { icon: <FiClock />, text: "History", path: "/history", protected: true },
    { icon: <FiFolder />, text: "My Content", path: "/mycontent", protected: true },
    { icon: <FiFolder />, text: "Collections", path: "/collections", protected: true },
    { icon: <FiUsers />, text: "Subscription", path: "/subscription", protected: true },
    { icon: <FiHelpCircle />, text: "Support", path: "/support" },
    { icon: <FiSettings />, text: "Settings", path: "/settings", protected: true },
  ];

  return (
    <aside className="w-1/5 min-h-screen bg-black text-white p-4 border-r border-gray-700">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <SidebarButton
            key={item.text}
            icon={item.icon}
            text={item.text}
            path={item.path}
            isActive={location.pathname.startsWith(item.path) && item.path !== "/"}
            isProtected={item.protected || false}
            isAuthenticated={isAuthenticated}
            navigate={navigate}
          />
        ))}
      </nav>
    </aside>
  );
};

const SidebarButton = ({ icon, text, path, isActive, isProtected, isAuthenticated, navigate }) => {
  const handleClick = () => {
    if (isProtected && !isAuthenticated) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <button
      className={`flex items-center space-x-3 w-full px-4 py-2 rounded transition ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800"
      }`}
      onClick={handleClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Sidebar;
