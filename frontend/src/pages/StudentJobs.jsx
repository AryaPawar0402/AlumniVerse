import React from "react";
import Navbar from "../components/Navbar";
import campus from "../assets/wce-campus.jpg";
import "./StudentDashboard.css";

const StudentJobs = () => {
  return (
    <div
      className="dashboard-container"
      style={{ backgroundImage: `url(${campus})` }}
    >
      <Navbar />
      <div className="dashboard-overlay">
        <div className="dashboard-content">
          <h1>Job Opportunities</h1>
          <p>Explore job opportunities posted by alumni and companies.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentJobs;
