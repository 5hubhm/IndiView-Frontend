import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiThumbsUp, FiClock, FiFolder, FiUsers, FiSettings, FiHelpCircle } from "react-icons/fi";
import api from "../utils/api";

const Sidebar = () => {
  const [active, setActive] = useState("Home");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Fetch current user, will refresh token if expired
        const response = await api.get("/api/v1/users/current-user");
        if (response.data) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <aside className="w-1/5 h-screen bg-black text-white p-4 border-r border-gray-700">
      <nav className="space-y-2">
        <SidebarButton icon={<FiHome />} text="Home" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />
        <SidebarButton icon={<FiThumbsUp />} text="Liked Videos" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />
        <SidebarButton icon={<FiClock />} text="History" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />
        <SidebarButton icon={<FiFolder />} text="My Content" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />
        <SidebarButton icon={<FiFolder />} text="Collections" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />
        <SidebarButton icon={<FiUsers />} text="Subscription" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />

        <div className="border-t border-gray-700 mt-4 pt-2"></div>

        <SidebarButton icon={<FiHelpCircle />} text="Support" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />
        <SidebarButton icon={<FiSettings />} text="Settings" active={active} setActive={setActive} isAuthenticated={isAuthenticated} navigate={navigate} />
      </nav>
    </aside>
  );
};

const SidebarButton = ({ icon, text, active, setActive, isAuthenticated, navigate }) => {
  const isActive = active === text;

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/login"); // ✅ Redirect to login if not authenticated
    } else {
      setActive(text);
      navigate(`/${text.replace(/\s+/g, "").toLowerCase()}`); // ✅ Navigate only if logged in
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
