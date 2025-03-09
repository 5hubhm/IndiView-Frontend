import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash, FiEye, FiThumbsUp } from "react-icons/fi";
import api from "../utils/api";

const MyContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get("/api/v1/videos");
      setVideos(response.data.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await api.delete(`/api/v1/videos/${id}`);
        setVideos(videos.filter((video) => video._id !== id));
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  // Sorting logic
  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "duration") return b.duration - a.duration;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Search filtering
  const filteredVideos = sortedVideos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Content</h1>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search videos..."
          className="bg-gray-800 text-white p-2 rounded-lg w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-gray-800 text-white p-2 rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest Uploads</option>
          <option value="views">Most Viewed</option>
          <option value="duration">Longest Duration</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading videos...</div>
      ) : filteredVideos.length === 0 ? (
        <p className="text-center text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-900 p-4 rounded-lg shadow-lg hover:bg-gray-800 transition relative"
            >
              <Link to={`/videos/${video._id}`}>
                <div className="relative w-full h-40">
                  <img
                    src={video.thumbnail || "/default-thumbnail.jpg"}
                    alt="Thumbnail"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(video.duration / 60)}:
                    {Math.floor(video.duration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </Link>

              <div className="mt-3">
                <h2 className="font-semibold text-lg truncate">{video.title}</h2>
                <p className="text-gray-400 text-sm">{video.views} views</p>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <FiThumbsUp className="text-green-400" /> {video.likes || 0} Likes
                </p>
              </div>

              {/* Video Management Actions */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Link to={`/edit-video/${video._id}`} className="text-blue-400">
                  <FiEdit size={20} />
                </Link>
                <button onClick={() => handleDelete(video._id)} className="text-red-400">
                  <FiTrash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContent;
