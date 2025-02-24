import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';

function Analysis() {
  const [artistLink, setArtistLink] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [artistPicture, setArtistPicture] = useState("");
  const [channelName, setChannelName] = useState("");
  const [subscriberCount, setSubscriberCount] = useState("");
  const [pdfDownloading, setPdfDownloading] = useState(false);

  useEffect(() => {
    const firstName = localStorage.getItem("loggedInUserFname") || "User";
    const lastName = localStorage.getItem("loggedInUserLname") || "";
    setUserName(`${firstName} ${lastName}`.trim());
  }, []);

  const handleLogout = () => {
    ["jwtToken", "loggedInUserFname", "loggedInUserLname"].forEach((key) => localStorage.removeItem(key));
    navigate("/");
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setMessage("");
    setPdfDownloading(false);

    try {
      const response = await fetch("http://127.0.0.1:5000/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistLink }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      const data = await response.json();

      setChannelName(data.channel_name);
      setSubscriberCount(data.subscriber_count);
      setArtistPicture(data.profile_picture);

      if (data.pdf_data) {
        setPdfDownloading(true);
        const pdfBytes = Uint8Array.from(atob(data.pdf_data), (char) => char.charCodeAt(0));
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        const pdfURL = URL.createObjectURL(pdfBlob);
        const pdfLink = document.createElement("a");
        pdfLink.href = pdfURL;
        pdfLink.setAttribute("download", `${data.channel_name}_report.pdf`);
        document.body.appendChild(pdfLink);
        pdfLink.click();
        document.body.removeChild(pdfLink);
      } else {
        throw new Error("No PDF data received.");
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
      setPdfDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white flex flex-col items-center justify-center p-8">
      <header className="absolute top-6 left-6 text-2xl font-extrabold text-yellow-400">
        Welcome, <span className="text-pink-400">{userName}</span> 🎶
      </header>

      {artistPicture && (
        <div className="flex flex-col items-center mb-6">
          <img
            src={artistPicture}
            alt="Artist"
            className="w-44 h-44 rounded-full border-4 border-yellow-400 shadow-xl object-cover mb-4 animate-fade-in"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">{channelName}</h2>
          <p className="text-md text-pink-400">Subscribers: {subscriberCount}</p>
        </div>
      )}

      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-6 animate-slide-in">
          Artist Analysis
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Enter the artist's homepage link to analyze their performance and download a detailed report.
        </p>

        <div className="flex w-full gap-4 mb-6">
          <input
            type="text"
            value={artistLink}
            onChange={(e) => setArtistLink(e.target.value)}
            className="flex-grow p-3 rounded-lg bg-gray-800 border-2 border-gray-700 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-md shadow-md"
            placeholder="Paste artist's homepage link..."
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !artistLink}
            className={`px-6 py-3 rounded-lg text-md font-bold transition-all shadow-md ${
              loading ? "bg-gray-500" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {pdfDownloading && <p className="text-yellow-400 text-md animate-pulse">⏳ Downloading PDF...</p>}
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-md font-bold shadow-md"
      >
        Logout
      </button>

      <footer className="absolute bottom-4 text-sm text-gray-500">
        © 2025 Scoutify. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Analysis;
