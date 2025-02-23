import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiThumbsUp,
  FiClock,
  FiFolder,
  FiUsers,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

const Sidebar = () => {
  const [active, setActive] = useState("Home");

  return (
    <aside className="w-1/5 h-screen bg-black text-white p-4 border-r border-gray-700">
      <nav className="space-y-2">
        <SidebarButton
          icon={<FiHome />}
          text="Home"
          active={active}
          setActive={setActive}
        />
        <SidebarButton
          icon={<FiThumbsUp />}
          text="Liked Videos"
          active={active}
          setActive={setActive}
        />
        <SidebarButton
          icon={<FiClock />}
          text="History"
          active={active}
          setActive={setActive}
        />
        <SidebarButton
          icon={<FiFolder />}
          text="My Content"
          active={active}
          setActive={setActive}
        />
        <SidebarButton
          icon={<FiFolder />}
          text="Collections"
          active={active}
          setActive={setActive}
        />
        <SidebarButton
          icon={<FiUsers />}
          text="Subscribers"
          active={active}
          setActive={setActive}
        />

        {/* Separator Line */}
        <div className="border-t border-gray-700 mt-4 pt-2"></div>

        <SidebarButton
          icon={<FiHelpCircle />}
          text="Support"
          active={active}
          setActive={setActive}
        />
        <SidebarButton
          icon={<FiSettings />}
          text="Settings"
          active={active}
          setActive={setActive}
        />
      </nav>
    </aside>
  );
};

// Sidebar button component with active state handling
const SidebarButton = ({ icon, text, active, setActive }) => {
  const isActive = active === text;
  return (
    <Link
      to={`/${text.replace(/\s+/g, "").toLowerCase()}`} // Converts "Liked Videos" → "/likedvideos"
      className={`flex items-center space-x-3 w-full px-4 py-2 rounded transition ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800"
      }`}
      onClick={() => setActive(text)}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export default Sidebar;
