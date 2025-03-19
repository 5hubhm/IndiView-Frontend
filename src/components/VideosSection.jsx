import { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const VideosSection = ({ username }) => {
    const [videos, setVideos] = useState([]);
    const [editingVideo, setEditingVideo] = useState(null);
    const [editData, setEditData] = useState({ title: "", description: "", thumbnail: "" });
    const [newThumbnail, setNewThumbnail] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({ title: "", description: "" });
    const [uploadThumbnail, setUploadThumbnail] = useState(null);
    const [uploadVideo, setUploadVideo] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get(`/api/v1/videos`);
                setVideos(response.data?.data || []);
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchVideos();
    }, [username]);

    // Open Edit Modal
    const handleEdit = (video) => {
        setEditingVideo(video._id);
        setEditData({ title: video.title, description: video.description, thumbnail: video.thumbnail });
        setNewThumbnail(null);
    };

    // Handle Thumbnail Change
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewThumbnail(file);
            setEditData({ ...editData, thumbnail: URL.createObjectURL(file) });
        }
    };

    // Save Edited Video
    const handleSaveEdit = async (videoId) => {
        try {
            const formData = new FormData();
            formData.append("title", editData.title);
            formData.append("description", editData.description);

            if (newThumbnail) {
                formData.append("thumbnail", newThumbnail);
            }

            const response = await api.patch(`/api/v1/videos/${videoId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Ensure correct headers
                },
            });

            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video._id === videoId ? { ...video, ...response.data.data } : video
                )
            );
            setEditingVideo(null);
        } catch (err) {
            console.error("Error updating video:", err);
        }
    };

    // Handle Upload
    const handleUploadVideo = async () => {
        if (!uploadData.title || !uploadData.description || !uploadThumbnail || !uploadVideo) {
            alert("All fields are required!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", uploadData.title);
            formData.append("description", uploadData.description);
            formData.append("thumbnail", uploadThumbnail);
            formData.append("videoFile", uploadVideo);

            const response = await api.post("/api/v1/videos", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setVideos([...videos, response.data.data]);
            setShowUploadModal(false);
        } catch (err) {
            console.error("Error uploading video:", err);
        }
    };

    // Handle delete confirmation
    const confirmDelete = async (videoId) => {
        try {
            await api.delete(`/api/v1/videos/${videoId}`);
            setVideos(videos.filter((video) => video._id !== videoId));
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error("Error deleting video:", err);
        }
    };


    return (
        <div className="p-6">
            {videos.length === 0 ? (
                <p className="text-gray-400 text-center">No videos uploaded</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos.map((video) => (
                        <div key={video._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <Link to={`/videos/${video._id}`} className="block">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <h1 className="text-xl font-bold mt-2">{video.title}</h1>
                            </Link>
                            {/* Buttons */}
                            <div className="flex justify-between mt-3">
                                <button
                                    onClick={() => handleEdit(video)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded transition hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(video._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded transition hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* Edit Modal */}
            {editingVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                    <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-lg relative max-h-[90vh] overflow-y-auto">

                        {/* Close Button */}
                        <button
                            onClick={() => setEditingVideo(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
                        >
                            ✖
                        </button>

                        {/* Header */}
                        <h2 className="text-xl font-bold text-white">Edit Video</h2>

                        {/* Thumbnail */}
                        <div className="mb-3">
                            <label className="block text-gray-300 mb-2">Thumbnail<span className="text-red-500">*</span></label>
                            <div className="border border-gray-600 rounded-lg overflow-hidden">
                                {editData.thumbnail ? (
                                    <img src={editData.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover" />
                                ) : (
                                    <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-gray-400">
                                        No thumbnail uploaded
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="mt-2 text-sm text-gray-400"
                            />
                        </div>

                        {/* Title Input */}
                        <div className="mb-3">
                            <label className="block text-gray-300 mb-2">Title<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Description<span className="text-red-500">*</span></label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="w-full p-2 h-28 bg-gray-800 text-white rounded border border-gray-700 resize-none"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setEditingVideo(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveEdit(editingVideo)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 text-center relative">
                        <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
                        >
                            ✖
                        </button>

                        <h2 className="text-xl font-bold mb-4">Delete Video?</h2>
                        <p className="text-gray-300 mb-4">Are you sure you want to delete this video? This action cannot be undone.</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Confirm
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* Upload Video Button */}
            <button
                onClick={() => setShowUploadModal(true)}
                className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600"
            >
                Upload Video
            </button>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-700">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
                        >
                            ✖
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-white mb-4">Upload Video</h2>

                        {/* Title Input */}
                        <input
                            type="text"
                            placeholder="Enter video title..."
                            value={uploadData.title}
                            onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                            className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700 mt-2 focus:ring-2 focus:ring-green-500 outline-none"
                        />

                        {/* Description Input */}
                        <textarea
                            placeholder="Enter video description..."
                            value={uploadData.description}
                            onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                            className="w-full p-2 h-24 bg-gray-800 text-white rounded-md border border-gray-700 resize-none mt-2 focus:ring-2 focus:ring-green-500 outline-none"
                        />

                        {/* Thumbnail Upload */}
                        <label className="block mt-3 text-gray-400 font-medium">
                            Upload Thumbnail:
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files.length > 0 && setUploadThumbnail(e.target.files[0])}
                            className="w-full text-sm text-gray-300 bg-gray-800 p-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition mt-1"
                        />
                        {uploadThumbnail && (
                            <p className="text-green-400 text-sm mt-1">✔ {uploadThumbnail.name}</p>
                        )}

                        {/* Video Upload */}
                        <label className="block mt-3 text-gray-400 font-medium">
                            Upload Video:
                        </label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => e.target.files.length > 0 && setUploadVideo(e.target.files[0])}
                            className="w-full text-sm text-gray-300 bg-gray-800 p-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition mt-1"
                        />
                        {uploadVideo && (
                            <p className="text-green-400 text-sm mt-1">✔ {uploadVideo.name}</p>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-between mt-5">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadVideo}
                                disabled={!uploadData.title || !uploadData.description || !uploadVideo}
                                className={`px-4 py-2 rounded-md transition ${uploadData.title && uploadData.description && uploadVideo
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-gray-500 cursor-not-allowed text-gray-300'
                                    }`}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default VideosSection;
