import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // glassy style
import walchandLogo from "../assets/walchand-logo.png";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role"); // clear role
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={walchandLogo} alt="Walchand Logo" className="navbar-logo" />
        <span className="navbar-title">Walchand Alumni Portal - Admin</span>
      </div>
      <div className="navbar-right">
        <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/admin/events" className="nav-link">Manage Events</Link>
        <Link to="/admin/view-events" className="nav-link">View Events</Link>
        <Link to="/admin/connections" className="nav-link">Connections</Link>
        <Link to="/admin/profile" className="nav-link">Profile</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
