import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import campus from "../assets/wce-campus.jpg";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `url(${campus})`,
      }}
    >
      <Navbar />
      <div className="dashboard-overlay">
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h1>Welcome to the Alumni Portal</h1>
            <p>Stay connected with Walchand alumni network.</p>

            {/* First row buttons */}
            <div className="dashboard-buttons">
              <Link to="/student/profile">
                <button>View Profile</button>
              </Link>
              <Link to="/student/events">
                <button>Alumni Events</button>
              </Link>
              <Link to="/student/network">
                <button>Networking</button>
              </Link>
            </div>

            {/* Second row buttons */}
            <div className="dashboard-buttons">
              <Link to="/student/jobs">
                <button>Job Opportunities</button>
              </Link>
              <Link to="/student/achievements">
                <button>Post Achievements</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
