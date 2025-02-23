import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {/* Main Content */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Welcome to IndiView</h2>
          <p className="text-gray-400">Explore videos and more.</p>
        </main>
      </div>
    </div>
  );
};

export default Home;
