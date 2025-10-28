import React from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import campus from "../assets/wce-campus.jpg";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div
      className="dashboard-container"
      style={{ backgroundImage: `url(${campus})` }}
    >
      <AdminNavbar />
      <div className="dashboard-overlay">
        <div className="dashboard-content">
          <div className="dashboard-card horizontal-card">
            <h1>Welcome, Admin</h1>
            <p>Manage college events, connections, and profiles.</p>
            <div className="dashboard-buttons">
              <Link to="/admin/events"><button>Manage Events</button></Link>
              <Link to="/admin/view-events"><button>View Events</button></Link>
              <Link to="/admin/connections"><button>Connections</button></Link>
              <Link to="/admin/profile"><button>Profile</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
