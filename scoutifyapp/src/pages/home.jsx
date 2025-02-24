import { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import React from 'react'; 
function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <section className="h-screen bg-cover bg-center flex items-center justify-center relative" style={{ backgroundImage: "url('/src/images/homebackgraoud.jpg')" }}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content Box */}
      <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-10 rounded-2xl shadow-2xl max-w-md text-center transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-5xl font-extrabold mb-4 text-white shadow-md">Looking for new musical talent?</h2>
        <p className="text-xl text-white mb-6">You're at the right place.</p>

        {/* Login Button */}
        <button onClick={() => setShowLogin(true)} className="inline-block px-8 py-3 text-lg font-medium text-blue-500 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300">
          Login
        </button>

        {/* Sign Up Link */}
        <p className="mt-4 text-white text-sm">
          Don't have an account?{" "}
          <button onClick={() => setShowSignup(true)} className="underline hover:text-gray-200 transition-colors">
            Sign Up
          </button>
        </p>
      </div>

      {/* Render Modals */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </section>
  );
}

export default Home;
