import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import AlumniNavbar from "../components/AlumniNavbar";
import AlumniProfileService from "../services/AlumniProfileService";
import campus from "../assets/wce-campus.jpg";
import "./AlumniDashboard.css";

const AlumniDashboard = () => {
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("🔄 Starting to fetch alumni data...");
        const profileData = await AlumniProfileService.getProfile();
        console.log("📊 Profile data:", profileData);
        setAlumni(profileData);
      } catch (err) {
        console.error("❌ Error in AlumniDashboard:", err);
        console.error("❌ Error response:", err.response?.data);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-screen">Loading Alumni Dashboard...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div
      className="dashboard-container"
      style={{ backgroundImage: `url(${campus})` }}
    >
      <AlumniNavbar />

      <div className="dashboard-overlay">
        <div className="dashboard-content">
          <div className="dashboard-card horizontal-card">
            <h1>Welcome, {alumni?.firstName || "Alumni"}!</h1>
            <p>Here's your Alumni Dashboard. Manage jobs, opportunities, and connections below.</p>

            <div className="dashboard-buttons">
              {/* ✅ UPDATED to use navigate instead of window.location */}
              <button onClick={() => navigate("/alumni/jobs")}>
                Post Jobs / Opportunities
              </button>
              <button onClick={() => navigate("/alumni/connections")}>
                View Connections
              </button>
              <button onClick={() => navigate("/alumni/view-jobs")}>
                View Posted Jobs
              </button>
            </div>

            {/* ✅ REMOVED the jobs list section completely */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;