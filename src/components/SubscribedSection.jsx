import { useEffect, useState } from "react";
import api from "../utils/api";

const SubscribedSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/subscriptions/getSubscribedChannels`
        );

        const data = response.data?.data;
        if (Array.isArray(data)) {
          setSubscriptions(data);
          setFilteredSubscriptions(data);
        } else {
          setSubscriptions([]);
          setFilteredSubscriptions([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredSubscriptions(
      subscriptions.filter((channel) =>
        channel.channel?.name?.toLowerCase().includes(query)
      )
    );
  };

  const toggleSubscribe = async (channelId) => {
    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/subscribe/${channelId}`);

      setFilteredSubscriptions((prev) =>
        prev.filter((channel) => channel.channel._id !== channelId)
      );

      setSubscriptions((prev) =>
        prev.filter((channel) => channel.channel._id !== channelId)
      );
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading subscriptions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={handleSearch}
        className="w-full px-4 py-2 mb-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      {filteredSubscriptions.length === 0 ? (
        <p className="text-gray-400 text-center">No subscriptions found.</p>
      ) : (
        <div className="space-y-4">
          {filteredSubscriptions.map(({ channel }) => (
            <div key={channel._id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <img
                  src={channel.avatar || "/default-avatar.jpg"}
                  alt={channel.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => (e.target.src = "/default-avatar.jpg")}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{channel.name}</h3>
                  <p className="text-gray-400">{channel.email}</p>
                </div>
              </div>
              <button
                onClick={() => toggleSubscribe(channel._id)}
                className="px-4 py-2 rounded-lg font-semibold transition bg-red-500 text-white"
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscribedSection;
