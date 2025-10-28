import React from "react";
import Navbar from "../components/Navbar";
import campus from "../assets/wce-campus.jpg";
import "./StudentDashboard.css";

const StudentNetwork = () => {
  return (
    <div
      className="dashboard-container"
      style={{ backgroundImage: `url(${campus})` }}
    >
      <Navbar />
      <div className="dashboard-overlay">
        <div className="dashboard-content">
          <h1>Networking</h1>
          <p>Connect with alumni and send connection requests.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentNetwork;
