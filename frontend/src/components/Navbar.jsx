import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import walchandLogo from "../assets/walchand-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear tokens/session if any
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={walchandLogo} alt="Walchand Logo" className="navbar-logo" />
        <span className="navbar-title">Walchand Alumni Portal</span>
      </div>
      <div className="navbar-right">
        <Link to="/student/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/student/profile" className="nav-link">Profile</Link>
        <Link to="/student/events" className="nav-link">Events</Link>
        <Link to="/student/network" className="nav-link">Network</Link>
        <Link to="/student/jobs" className="nav-link">Job Opportunities</Link>
        <Link to="/student/achievements" className="nav-link">Achievements</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
