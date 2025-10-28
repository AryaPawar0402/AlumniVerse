import React from "react";
import { Link, useNavigate } from "react-router-dom";
import walchandLogo from "../assets/walchand-logo.png";
import "../components/Navbar.css"; // reuse Navbar styling

const AlumniNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Use "token" instead of "alumniToken"
    localStorage.removeItem("role"); // ✅ Also remove role
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={walchandLogo} alt="Walchand Logo" className="navbar-logo" />
        <span className="navbar-title">Walchand Alumni Portal</span>
      </div>
      <div className="navbar-right">
        <Link to="/alumni/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/alumni/profile" className="nav-link">Profile</Link>
        <Link to="/alumni/jobs" className="nav-link">Post Jobs</Link>
        {/* ✅ ADDED View Jobs Link */}
        <Link to="/alumni/view-jobs" className="nav-link">View Jobs</Link>
        <Link to="/alumni/connections" className="nav-link">Connections</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default AlumniNavbar;