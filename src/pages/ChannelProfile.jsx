import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import VideosSection from "../components/VideosSection";
import PlaylistSection from "../components/PlaylistSection";
import TweetsSection from "../components/TweetsSection";
import SubscribedSection from "../components/SubscribedSection";

const ChannelProfile = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/c/${username}`
        );
        setChannel(response.data?.data || {});
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={channel.coverImage || "/default-cover.jpg"}
          alt="Cover"
          className="w-full h-56 object-cover rounded-b-lg shadow-lg"
          onError={(e) => (e.target.src = "/default-cover.jpg")}
        />
        <div className="absolute -bottom-14 left-6">
          <img
            src={channel.avatar || "/default-avatar.jpg"}
            alt="Avatar"
            className="w-28 h-28 object-cover rounded-full border-4 border-gray-800 shadow-lg"
            onError={(e) => (e.target.src = "/default-avatar.jpg")}
          />
        </div>
        {channel.isOwner && (
          <button className="absolute top-4 right-6 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition-transform transform hover:scale-105 shadow-md">
            ✏ Edit
          </button>
        )}
      </div>

      {/* Channel Info */}
      <div className="mt-16 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{channel.fullName || "Unknown User"}</h1>
          <p className="text-gray-400">@{channel.username || "N/A"}</p>
          <p className="text-gray-400">
            {channel.subscribersCount} Subscribers • {channel.channelsSubscribedToCount} Subscribed
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mt-6 px-6">
        {["videos", "playlist", "tweets", "subscribed"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-3 text-lg font-semibold transition-colors ${
              activeTab === tab
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="px-6 py-4">
        {activeTab === "videos" && <VideosSection username={username} />}
        {activeTab === "playlist" && <PlaylistSection username={username} />}
        {activeTab === "tweets" && <TweetsSection username={username}/>}
        {activeTab === "subscribed" && <SubscribedSection username={username}/>}
      </div>
    </div>
  );
};

export default ChannelProfile;
