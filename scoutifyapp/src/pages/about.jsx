import Navbar from "../components/navbar";
import React from 'react'; 
function About() {
    return (
      <section className="h-screen bg-gray-900 text-white flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          {/* Section Title */}
          <h2 className="text-5xl font-extrabold text-blue-400 mb-6">
            About Scoutify
          </h2>
  
          {/* Brief Description */}
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Scoutify is your ultimate A&R tool, designed to help record labels, music scouts, and industry professionals identify rising talent on YouTube. Upload any artist's YouTube profile, and we generate data-driven scouting reports, including growth analysis, performance metrics, and industry trends to help labels make the right hiring decisions.
          </p>
  
          {/* Features Section */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">Why Choose Us?</h3>
  
            <ul className="text-gray-300 space-y-3 text-left">
              <li className="flex items-center">
                <span className="text-blue-400 text-xl mr-2">✔</span> Detailed Growth Reports - Track an artist's audience engagement, views, and fan growth.
              </li>
              <li className="flex items-center">
                <span className="text-blue-400 text-xl mr-2">✔</span> Performance Metrics - Understand an artist's impact, retention, and virality.
              </li>
              <li className="flex items-center">
                <span className="text-blue-400 text-xl mr-2">✔</span> Scouting Decision Support - Get AI-driven recommendations on whether a label should sign an artist.
              </li>
              <li className="flex items-center">
                <span className="text-blue-400 text-xl mr-2">✔</span> Charts & Rankings - Compare artists across genres and track industry trends.
              </li>
            </ul>
          </div>
  
          {/* Fun Facts Section */}
          <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">🎵 Did You Know?</h3>
            <p className="text-gray-300">
              - 87% of successful independent artists saw over 140% growth after signing with a label.  
              - Major labels scout over 4,000 YouTube musicians every year.  
              - Data-driven scouting has increased label revenue by 40% in the last 5 years.  
              - YouTube is now the #1 platform for discovering new artists before they break into mainstream success.  
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  export default About;
  