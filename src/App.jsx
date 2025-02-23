import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChannelProfile from "./pages/ChannelProfile";
import DashboardLayout from "./pages/DashBoardLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes with Sidebar (Using Layout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/c/:username" element={<ChannelProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
