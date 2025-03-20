import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div
      className="relative flex flex-col h-screen text-white bg-cover bg-center"
    >
      {/* Overlay Blur */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md"></div>

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center text-center h-full px-6">
        <motion.h1
          className="text-5xl font-bold tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-purple-500">IndiView</span>
        </motion.h1>
        <motion.p
          className="text-gray-300 text-lg mt-2 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Your destination for high-quality videos. Explore, watch, and connect with content that matters.
        </motion.p>
      </main>
    </div>
  );
};

export default Home;
