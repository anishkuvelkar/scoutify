import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setIsValid(validateLogin(false));
  }, [formData]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
    return emailRegex.test(email);
  };

  const validateLogin = (updateErrors = true) => {
    let newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (updateErrors) setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        const response = await fetch('http://localhost:8000/auth/login', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Store the JWT token, name, and lastname in localStorage
          localStorage.setItem('jwtToken', data.jwtToken);
          localStorage.setItem('loggedInUserFname', data.name);
          localStorage.setItem('loggedInUserLname', data.lastname);
          
          // Console log the stored values
          console.log("JWT Token:", data.jwtToken);
          console.log("First Name:", data.name);
          console.log("Last Name:", data.lastname);
          
          alert("Login successful!");
          onClose(); // Close the modal

          // Navigate to the analysis page
          navigate('/analysis'); // Navigate to Analysis page
        } else {
          setLoginError(data.message); // Set the login error message if login fails
        }
      } catch (err) {
        console.error(err);
        setLoginError("An error occurred. Please try again."); // Set a generic error message
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative w-96 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white transition duration-300">
          ✕
        </button>

        <h2 className="text-3xl font-extrabold text-white text-center mb-6">Welcome Back</h2>

        {loginError && <p className="text-red-400 text-sm">{loginError}</p>} 

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold transition duration-300 shadow-lg ${
              isValid
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isValid}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
