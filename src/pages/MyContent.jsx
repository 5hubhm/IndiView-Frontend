import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const MyContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">My Content</h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading videos...</div>
      ) : videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="space-y-6">
          {videos.map((video) => (
            <Link to={`/videos/${video._id}`} key={video._id} className="block">
              <div className="flex gap-4 items-start bg-gray-900 p-4 rounded-lg shadow-lg hover:bg-gray-800 transition">
                <div className="relative w-52 h-32 flex-shrink-0">
                  <img src={video.thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{video.title}</h2>
                  <p className="text-gray-400 text-sm">{video.views} views</p>
                  <p className="text-gray-400 text-sm">{video.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContent;
