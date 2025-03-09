import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - Increased Width */}
        <div className="flex-1 mx-auto max-w-[1400px] w-full p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
