import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../api/user";

const ChannelProfile = () => {
  const { username } = useParams(); // Get username from URL
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const data = await getUserChannelProfile(username);
        setChannel(data.data); // Backend returns data inside `.data`
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={channel.coverImage || "/default-cover.jpg"}
          alt="Cover"
          className="w-full h-52 object-cover"
        />
        <div className="absolute -bottom-12 left-6">
          <img
            src={channel.avatar || "/default-avatar.jpg"}
            alt="Avatar"
            className="w-24 h-24 object-cover rounded-full border-4 border-black shadow-lg"
          />
        </div>
      </div>

      {/* Channel Info */}
      <div className="mt-14 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{channel.fullName}</h1>
          <p className="text-gray-400">@{channel.username}</p>
          <p className="text-gray-400">
            {channel.subscribersCount} Subscribers • {channel.channelsSubscribedToCount} Subscribed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;
