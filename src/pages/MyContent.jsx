import { useState, useEffect } from "react";
import { FiUpload, FiEdit, FiTrash } from "react-icons/fi";
import api from "../utils/api";

const MyContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/videos");
      setVideos(response.data.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    if (!formData.videoFile || !formData.thumbnail) return;

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("videoFile", formData.videoFile);
    uploadData.append("thumbnail", formData.thumbnail);

    setLoading(true);
    try {
      await api.post("/api/v1/videos", uploadData);
      fetchVideos();
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-6">
      {/* Dim Background When Modal is Open */}
      {showModal && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}

      {/* Main Content - Hidden When Modal is Open */}
      <div className={`${showModal ? "hidden" : "block"}`}>
        <h1 className="text-3xl font-bold mb-6 text-center">My Content</h1>

        {/* Upload Button - Floating */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-10 right-10 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500 transition flex items-center gap-2"
        >
          <FiUpload /> Upload Video
        </button>

        {/* Video List */}
        {loading && <p className="text-center">Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-800 p-4 rounded-lg shadow-lg relative">
              <img src={video.thumbnail} alt="Thumbnail" className="w-full rounded-md" />
              <h2 className="mt-2 font-semibold text-lg">{video.title}</h2>
              <p className="text-sm text-gray-400">{video.description}</p>
              <div className="flex justify-between mt-3">
                <button className="text-yellow-400 flex items-center gap-1 hover:text-yellow-300">
                  <FiEdit /> Edit
                </button>
                <button className="text-red-500 flex items-center gap-1 hover:text-red-400">
                  <FiTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white w-[90%] max-w-4xl p-8 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-400 transition"
            >
              ✖
            </button>

            {/* Upload Form */}
            <h2 className="text-3xl font-bold text-center mb-6">Upload Video</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="title"
                placeholder="Video Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Video Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 rounded"
                required
              />

              {/* File Upload Inputs */}
              <div>
                <label className="block mb-2">Select Video File:</label>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full bg-gray-800 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Select Thumbnail:</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-gray-800 p-2 rounded"
                  required
                />
              </div>
            </div>

            {/* Upload Button - Centered */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleUpload}
                className="px-6 py-3 bg-blue-600 rounded text-lg hover:bg-blue-500 transition"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContent;
