import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChannelProfile from "./pages/ChannelProfile";
import DashboardLayout from "./pages/DashboardLayout";
import Support from "./pages/Support";
import MyContent from "./pages/MyContent";
import VideoPage from "./pages/VideoPage";
import posthog from 'posthog-js'

posthog.init(import.meta.env.POSTHOG_API_KEY, {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // Best practice for privacy
    capture_pageview: true,             // Tracks navigation automatically
})


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
          <Route path="/Support" element={<Support />} />
          <Route path="/mycontent" element={<MyContent />} />
          <Route path="/videos/:id" element={<VideoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
