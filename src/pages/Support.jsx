import React, { useState } from "react";
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Support = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000); // Reset after 5 seconds
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-black text-white px-6 py-12">
            {/* Contact & Social Links */}
            <div className="max-w-3xl w-full bg-gray-900 p-8 rounded-lg shadow-xl text-center mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-100">Connect With Us</h2>
                <p className="text-gray-400 mb-6">Follow us or reach out for support.</p>

                <div className="flex justify-center space-x-8">
                    <a href="https://www.instagram.com/subhm.04/" target="_blank" rel="noopener noreferrer" className="group">
                        <FaInstagram size={30} className="text-gray-300 group-hover:text-pink-500 transition transform group-hover:scale-110" />
                        <span className="text-sm mt-2 block text-gray-400">Instagram</span>
                    </a>
                    <a href="https://www.linkedin.com/in/shubham-karvariya-6ab142326/" target="_blank" rel="noopener noreferrer" className="group">
                        <FaLinkedin size={30} className="text-gray-300 group-hover:text-blue-500 transition transform group-hover:scale-110" />
                        <span className="text-sm mt-2 block text-gray-400">LinkedIn</span>
                    </a>
                    <a href="https://github.com/5hubhm" target="_blank" rel="noopener noreferrer" className="group">
                        <FaGithub size={30} className="text-gray-300 group-hover:text-white transition transform group-hover:scale-110" />
                        <span className="text-sm mt-2 block text-gray-400">GitHub</span>
                    </a>
                    <a href="mailto:shubhamkarwariya245@gmail.com" className="group">
                        <FaEnvelope size={30} className="text-gray-300 group-hover:text-red-500 transition transform group-hover:scale-110" />
                        <span className="text-sm mt-2 block text-gray-400">Email</span>
                    </a>
                </div>
            </div>



            {/* FAQ Section */}
            <div className="max-w-3xl w-full bg-gray-900 p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="bg-gray-800 p-4 rounded-lg">
                        <summary className="cursor-pointer font-semibold text-blue-400">How can I report an issue?</summary>
                        <p className="text-gray-300 mt-2">You can report an issue by using the contact form above or emailing us at support@indiview.com.</p>
                    </details>
                    <details className="bg-gray-800 p-4 rounded-lg">
                        <summary className="cursor-pointer font-semibold text-blue-400">Do you offer 24/7 support?</summary>
                        <p className="text-gray-300 mt-2">Currently, we provide support from 9 AM to 9 PM IST.</p>
                    </details>
                    <details className="bg-gray-800 p-4 rounded-lg">
                        <summary className="cursor-pointer font-semibold text-blue-400">How do I delete my account?</summary>
                        <p className="text-gray-300 mt-2">To delete your account, please email us at support@indiview.com with your registered email.</p>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default Support;
