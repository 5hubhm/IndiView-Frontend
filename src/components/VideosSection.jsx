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
    const [uploadProgress, setUploadProgress] = useState(0); // state to track progress

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

    const handleEdit = (video) => {
        setEditingVideo(video._id);
        setEditData({ title: video.title, description: video.description, thumbnail: video.thumbnail });
        setNewThumbnail(null);
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewThumbnail(file);
            setEditData({ ...editData, thumbnail: URL.createObjectURL(file) });
        }
    };

    const handleSaveEdit = async (videoId) => {
        try {
            const formData = new FormData();
            formData.append("title", editData.title);
            formData.append("description", editData.description);
            if (newThumbnail) {
                formData.append("thumbnail", newThumbnail);
            }

            const response = await api.patch(`/api/v1/videos/${videoId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
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
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted); // update progress
                },
            });

            setVideos([...videos, response.data.data]);
            setShowUploadModal(false);
            setUploadProgress(0); // reset progress after successful upload
        } catch (err) {
            console.error("Error uploading video:", err);
            setUploadProgress(0); // reset progress on error
        }
    };


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
        <div className="relative p-6 min-h-screen">
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
                            <div className="flex justify-between mt-3">
                                <button
                                    onClick={() => handleEdit(video)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(video._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="relative z-10 w-full max-w-md bg-gray-950 text-white rounded-2xl shadow-2xl p-6">
                        <button
                            onClick={() => setEditingVideo(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold mb-4">Edit Video</h2>

                        <label className="block text-sm mb-1">Thumbnail</label>
                        <div className="mb-3">
                            {editData.thumbnail ? (
                                <img src={editData.thumbnail} className="w-full h-40 object-cover rounded" />
                            ) : (
                                <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded text-gray-400">
                                    No Thumbnail
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="mt-2 text-sm" />
                        </div>

                        <label className="block text-sm mb-1">Title</label>
                        <input
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 mb-3"
                        />

                        <label className="block text-sm mb-1">Description</label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="w-full px-3 py-2 h-24 rounded bg-gray-800 text-white border border-gray-700 resize-none mb-4"
                        />

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setEditingVideo(null)}
                                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveEdit(editingVideo)}
                                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="relative z-10 w-full max-w-md bg-gray-950 text-white rounded-2xl shadow-2xl p-6">
                        <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold mb-4">Delete Video?</h2>
                        <p className="text-gray-300 mb-4">Are you sure you want to delete this video?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="relative z-10 w-full max-w-md bg-gray-950 text-white rounded-2xl shadow-2xl p-6">

                        {/* Close Button */}
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                        >
                            &times;
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Upload New Video</h2>

                        {/* Title Input */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                placeholder="Enter video title"
                                value={uploadData.title}
                                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Description Textarea */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                placeholder="Write a brief description..."
                                value={uploadData.description}
                                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-1">Thumbnail</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUploadThumbnail(e.target.files[0])}
                                className="w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                        </div>

                        {/* Video Upload */}
                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-1">Video File</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setUploadVideo(e.target.files[0])}
                                className="w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadVideo}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Upload Button */}
            <button
                onClick={() => setShowUploadModal(true)}
                className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 z-40"
            >
                Upload Video
            </button>
        </div>
    );

};

export default VideosSection;
