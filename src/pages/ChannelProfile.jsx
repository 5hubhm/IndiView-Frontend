import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../api/user";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ChannelProfile = () => {
  const { username } = useParams(); // Get username from URL
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const data = await getUserChannelProfile(username);
        setChannel(data.data); // Backend returns data inside `.data`
        setIsLoggedIn(true); // Assuming user is logged in when data is fetched successfully
      } catch (err) {
        setError(err.message || "Failed to load channel");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [username]);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {/* Main Layout (Sidebar + Profile Content) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Profile Content */}
        <div className="flex-1 max-w-4xl mx-auto mt-8 p-4">
          {/* Cover Image */}
          <div className="relative">
            <img
              src={channel.coverImage || "/default-cover.jpg"}
              alt="Cover"
              className="w-full h-60 object-cover rounded-lg"
            />
            <div className="absolute -bottom-10 left-4">
              <img
                src={channel.avatar || "/default-avatar.jpg"}
                alt="Avatar"
                className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Channel Info */}
          <div className="mt-14 text-center">
            <h1 className="text-2xl font-bold">{channel.fullName}</h1>
            <p className="text-gray-400">@{channel.username}</p>
            <div className="mt-2 flex justify-center space-x-6 text-gray-400">
              <span>{channel.subscribersCount} Subscribers</span>
              <span>{channel.channelsSubscribedToCount} Subscribed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;
