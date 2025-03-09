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

    return (
        <div className="bg-black text-white min-h-screen px-0 md:px-6 flex flex-col md:flex-row gap-6 max-w-[1200px] mx-auto">
            {loading ? (
                <div className="text-center text-gray-400 w-full">Loading video...</div>
            ) : video ? (
                <>
                    {/* Main Video Section */}
                    <div className="flex-1">
                        <video controls className="w-full h-[500px] rounded-lg shadow-lg">
                            <source src={video.videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Video Details */}
                        <div className="mt-4">
                            <h1 className="text-xl font-bold">{video.title}</h1>
                            <p className="text-gray-400 text-sm">
                                {video.views} views · {new Date(video.createdAt).toLocaleString()}
                            </p>

                            {/* Uploader Info */}
                            <div className="flex items-center mt-4">
                                <img src={user?.avatar || "/default-avatar.png"} alt="Uploader" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold">{user?.fullName || "Unknown"}</p>
                                    <p className="text-gray-500 text-sm">@{user?.username || "username"}</p>
                                </div>
                                <button className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-lg">
                                    Subscribe
                                </button>
                            </div>

                            {/* Engagement Buttons */}
                            <div className="mt-4 flex gap-4">
                                <button className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg">
                                    <FiThumbsUp /> {video.likes || 0}
                                </button>
                                <button className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg">
                                    <FiThumbsDown /> {video.dislikes || 0}
                                </button>
                                <button className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg">
                                    <FiSave /> Save
                                </button>
                            </div>

                            {/* Description */}
                            <p className="mt-4 text-gray-300">{video.description}</p>
                        </div>
                    </div>

                    {/* Related Videos Section */}
                    <div className="w-full md:w-[350px]">
                        <h2 className="text-lg font-semibold mb-4">More from {user?.fullName || "this uploader"}</h2>
                        <div className="flex flex-col gap-4">
                            {relatedVideos.map((vid) => (
                                <Link to={`/videos/${vid._id}`} key={vid._id} className="flex gap-2 hover:bg-gray-800 p-2 rounded-lg">
                                    <img src={vid.thumbnail || "/default-thumbnail.jpg"} alt={vid.title}
                                        className="w-28 h-16 object-cover rounded-lg" />
                                    <div>
                                        <p className="text-sm font-semibold">{vid.title}</p>
                                        <p className="text-gray-400 text-xs">{vid.views} views · {new Date(vid.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ))}
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
