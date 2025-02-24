import React, { useState, useEffect } from "react";
import axios from "axios";

const Signup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);

    const validateSignup = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (!formData.name.trim()) newErrors.name = "First name is required";
        if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
        if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (Object.values(formData).some(value => value)) {
            setIsDisabled(!validateSignup());
        } else {
            setIsDisabled(true); 
        }
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateSignup()) {
            try {
                // Create a new object without confirmPassword
                const { confirmPassword, ...dataToSend } = formData;

                const response = await axios.post("http://localhost:8000/auth/signup", dataToSend);
                if (response.status === 201) {
                    alert("Signup successful!");
                    onClose();
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert("Signup failed. Please try again.");
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md" onClick={onClose}>
            <div
                className="relative w-96 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 border border-white/30"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white transition duration-300 text-xl">
                    ✕
                </button>

                <h2 className="text-3xl font-extrabold text-white text-center mb-6">Create an Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

                    <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    />
                    {errors.lastname && <p className="text-red-400 text-sm">{errors.lastname}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-full py-3 rounded-lg font-bold transition duration-300 shadow-lg ${
                            isDisabled
                                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:scale-105"
                        }`}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
