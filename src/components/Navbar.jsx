import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.jpg";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/current-user`,
                    { withCredentials: true } // Ensures JWT is sent
                );

                if (res.data?.data) {
                    setUser(res.data.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error.response?.data || error.message);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout Error:", error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex justify-between items-center px-6 py-3 bg-black border-b border-gray-700">
            {/* Logo and Search Bar */}
            <div className="flex items-center space-x-3">
                <Link to="/">
                    <img src={logo} alt="IndiView Logo" className="w-12 h-12 cursor-pointer" />
                </Link>
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-800 text-white px-4 py-2 rounded w-80"
                />
            </div>

            {/* User Profile Section */}
            <div className="relative" ref={menuRef}>
                {user ? (
                    <div className="flex items-center space-x-4">
                        {/* Profile Button */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white flex items-center space-x-2">
                            <span className="font-semibold">{user.username}</span>
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full cursor-pointer border border-purple-500"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                                <div className="p-3 text-center">
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                                <hr className="border-gray-700" />
                                <Link to="/profile" className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-gray-400 hover:text-white">Log in</Link>
                        <Link to="/signup" className="bg-purple-500 px-4 py-2 rounded text-white">Sign up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
