import React from "react";
import Navbar from "../components/navbar";
function Contact() {
  return (
    <section className="h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center text-white">
      <div className="max-w-md mx-auto p-10 bg-gray-700 rounded-lg shadow-lg border-2 border-gray-600">
        <h2 className="text-5xl font-extrabold text-center mb-6">Contact Us</h2>
        <p className="text-xl text-center mb-4 italic">We’d love to hear from you!</p>
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Email:</h3>
            <p className="text-gray-300">akuvelka@syr.edu</p>
            <p className="text-gray-300">HR@scoutify.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Phone:</h3>
            <p className="text-gray-300">+1 680 207 9450</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">LinkedIn:</h3>
            <a
              href="https://www.linkedin.com/in/anishkuvelkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              linkedin.com/in/anishkuvelkar
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Instagram:</h3>
            <a
              href="https://www.instagram.com/anishkuvelkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              instagram.com/anishkuvelkar
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Social Media:</h3>
            <p className="text-gray-300">Follow us on:</p>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
