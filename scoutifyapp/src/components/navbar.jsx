import { NavLink } from 'react-router-dom';
import React from 'react'; 
function Navbar() {
  return (
    <nav className="bg-gray-800 border-2 border-black shadow-lg rounded-lg p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-4xl font-extrabold transition-transform transform hover:scale-105">
          SCOUTIFY
        </div>
        <ul className="flex space-x-8 md:space-x-10 text-lg">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-400 font-bold border-b-2 border-blue-400 hover:text-blue-300 transition duration-300'
                  : 'text-gray-300 hover:text-blue-400 transition duration-300'
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-400 font-bold border-b-2 border-blue-400 hover:text-blue-300 transition duration-300'
                  : 'text-gray-300 hover:text-blue-400 transition duration-300'
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-400 font-bold border-b-2 border-blue-400 hover:text-blue-300 transition duration-300'
                  : 'text-gray-300 hover:text-blue-400 transition duration-300'
              }
            >
              Clients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-400 font-bold border-b-2 border-blue-400 hover:text-blue-300 transition duration-300'
                  : 'text-gray-300 hover:text-blue-400 transition duration-300'
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
