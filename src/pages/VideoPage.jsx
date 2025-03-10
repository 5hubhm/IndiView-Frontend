import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiThumbsUp, FiThumbsDown, FiSave, FiChevronDown, FiChevronUp } from "react-icons/fi";
import api from "../utils/api";

const VideoPage = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        fetchVideo(id, setVideo, setUser, setLoading);
    }, [id]);

    return (
        <div className="bg-black text-white min-h-screen px-4 md:px-6 flex flex-col md:flex-row gap-6 max-w-[1200px] mx-auto">
            {loading ? (
                <div className="text-center text-gray-400 w-full">Loading video...</div>
            ) : video ? (
                <>
                    <div className="flex-1 bg-gray-900 p-5 rounded-lg shadow-lg">
                        <video controls className="w-full h-[500px] rounded-lg shadow-lg" poster={video.thumbnail}>
                            <source src={video.videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="mt-4">
                            <h1 className="text-xl font-bold">{video.title}</h1>
                            <p className="text-gray-400 text-sm">
                                {formatViews(video.views)} views · {new Date(video.createdAt).toLocaleDateString()}
                            </p>
                            <UserDetails user={user} />
                            <VideoActions video={video} />
                            <div className="mt-4 text-gray-300 leading-relaxed">
                                <p className={showFullDescription ? "" : "line-clamp-2 overflow-hidden"}>
                                    {video.description}
                                </p>
                                <button
                                    className="text-blue-400 flex items-center mt-2 cursor-pointer"
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                >
                                    {showFullDescription ? "Show Less" : "Show More"} {showFullDescription ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center text-red-500 w-full">Video not found.</div>
            )}
        </div>
    );
};

const fetchVideo = async (id, setVideo, setUser, setLoading) => {
    try {
        const response = await api.get(`/api/v1/videos/${id}`);
        const videoData = response.data.data;
        setVideo(videoData);

        if (videoData.owner?.username) {
            fetchUser(videoData.owner.username, setUser);
        }
    } catch (error) {
        console.error("Error fetching video:", error);
    } finally {
        setLoading(false);
    }
};

const fetchUser = async (username, setUser) => {
    try {
        const userResponse = await api.get(`/api/v1/users/c/${username}`);
        setUser(userResponse.data.data);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
};

const formatViews = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num;
};

const UserDetails = ({ user }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = async () => {
        if (!user || !user._id) return;

        try {
            await api.post(`/api/v1/subscriptions/c/${user._id}`);
            setIsSubscribed(true);
        } catch (error) {
            console.error("Subscription failed:", error);
        }
    };

    return (
        <div className="flex items-center mt-4">
            <img src={user?.avatar || "/default-avatar.png"} alt="Uploader"
                className="w-12 h-12 rounded-full object-cover border border-gray-700" />
            <div className="ml-3">
                <p className="font-semibold text-lg">{user?.fullName || "Unknown"}</p>
                <p className="text-gray-500 text-sm">@{user?.username || "username"}</p>
            </div>
            <button
                onClick={handleSubscribe}
                disabled={isSubscribed}
                className={`ml-auto px-4 py-2 rounded-lg transition cursor-pointer ${
                    isSubscribed ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
            >
                {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
        </div>
    );
};

const VideoActions = ({ video }) => (
    <div className="mt-4 flex gap-4">
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            <FiThumbsUp className="text-green-400 cursor-pointer" /> {video.likes || 0}
        </button>
        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            <FiThumbsDown className="text-red-400 cursor-pointer" /> {video.dislikes || 0}
        </button>
    </div>
);

export default VideoPage;
