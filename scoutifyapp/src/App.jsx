import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import {Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Clients from "./pages/clients";
import Contact from "./pages/contact";
import Analysis from "./pages/analysis";
import { useState } from "react";
import RefrshHandler from "./RefreshHandler";
import React from 'react'; 
function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/analysis"; 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({ element }) => {
  return isAuthenticated ? element : <Navigate to="/" />
  }
  return (
    <>
    <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/analysis' element={<PrivateRoute element={<Analysis />} />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
