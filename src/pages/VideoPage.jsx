import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiThumbsUp, FiThumbsDown, FiSave } from "react-icons/fi";
import api from "../utils/api";

const VideoPage = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideo();
    }, [id]);

    const fetchVideo = async () => {
        try {
            const response = await api.get(`/api/v1/videos/${id}`);
            const videoData = response.data.data;
            setVideo(videoData);

            if (videoData.owner?._id) {
                fetchUser(videoData.owner._id);
            }

            const relatedResponse = await api.get(`/api/v1/videos`);
            setRelatedVideos(relatedResponse.data.data);
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async (userId) => {
        try {
            const userResponse = await api.get(`/api/v1/users/current-user`);
            const userData = userResponse.data.data;

            if (userData._id === userId) {
                setUser(userData);
            } else if (userData.username) {
                const fullUserResponse = await api.get(`/api/v1/users/c/${userData.username}`);
                setUser(fullUserResponse.data.data);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const formatViews = (num) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num;
    };

    return (
        <div className="bg-black text-white min-h-screen px-4 md:px-6 flex flex-col md:flex-row gap-6 max-w-[1200px] mx-auto">
            {loading ? (
                <div className="text-center text-gray-400 w-full">Loading video...</div>
            ) : video ? (
                <>
                    {/* Main Video Section (Wrapped in a Card) */}
                    <div className="flex-1 bg-gray-900 p-5 rounded-lg shadow-lg">
                        <video controls className="w-full h-[500px] rounded-lg shadow-lg">
                            <source src={video.videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Video Details */}
                        <div className="mt-4">
                            <h1 className="text-xl font-bold">{video.title}</h1>
                            <p className="text-gray-400 text-sm">
                                {formatViews(video.views)} views · {new Date(video.createdAt).toLocaleDateString()}
                            </p>

                            {/* Uploader Info */}
                            <div className="flex items-center mt-4">
                                <img src={user?.avatar || "/default-avatar.png"} alt="Uploader"
                                    className="w-12 h-12 rounded-full object-cover border border-gray-700" />
                                <div className="ml-3">
                                    <p className="font-semibold text-lg">{user?.fullName || "Unknown"}</p>
                                    <p className="text-gray-500 text-sm">@{user?.username || "username"}</p>
                                </div>
                                <button className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
                                    Subscribe
                                </button>
                            </div>

                            {/* Engagement Buttons */}
                            <div className="mt-4 flex gap-4">
                                <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    <FiThumbsUp className="text-green-400" /> {video.likes || 0}
                                </button>
                                <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    <FiThumbsDown className="text-red-400" /> {video.dislikes || 0}
                                </button>
                                <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                                    <FiSave /> Save
                                </button>
                            </div>

                            {/* Description */}
                            <p className="mt-4 text-gray-300 leading-relaxed">{video.description}</p>
                        </div>
                    </div>

                    {/* Related Videos Section (Wrapped in a Card) */}
                    <div className="w-full md:w-[350px] bg-gray-900 p-5 rounded-lg shadow-lg sticky top-20">
                        <h2 className="text-lg font-semibold mb-4">More from {user?.fullName || "this uploader"}</h2>
                        <div className="flex flex-col gap-4">
                            {relatedVideos.length === 0 ? (
                                <p className="text-gray-400 text-center">No related videos found.</p>
                            ) : (
                                relatedVideos.map((vid) => (
                                    <Link to={`/videos/${vid._id}`} key={vid._id}
                                        className="flex gap-3 items-start bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition">
                                        <img src={vid.thumbnail || "/default-thumbnail.jpg"} alt={vid.title}
                                            className="w-24 h-14 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{vid.title}</p>
                                            <p className="text-gray-400 text-xs">{formatViews(vid.views)} views · {new Date(vid.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center text-red-500 w-full">Video not found.</div>
            )}
        </div>
    );
};

export default VideoPage;
