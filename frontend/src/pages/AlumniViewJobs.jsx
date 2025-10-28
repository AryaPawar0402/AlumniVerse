import React, { useEffect, useState } from "react";
import AlumniNavbar from "../components/AlumniNavbar";
import campus from "../assets/wce-campus.jpg";
import { FaMapMarkerAlt, FaExternalLinkAlt, FaTrash, FaPlus } from "react-icons/fa";
import "./AlumniViewJobs.css";

const AlumniViewJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem('alumniPostedJobs');
    if (savedJobs) {
      const parsedJobs = JSON.parse(savedJobs);
      if (Array.isArray(parsedJobs)) {
        setJobs(parsedJobs);
      }
    }
  }, []);

  const deleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      setJobs(updatedJobs);
      localStorage.setItem('alumniPostedJobs', JSON.stringify(updatedJobs));
      alert("Job deleted successfully!");
    }
  };

  return (
    <div className="alumni-viewjobs-container" style={{ backgroundImage: `url(${campus})` }}>
      <AlumniNavbar />

      <div className="alumni-viewjobs-overlay">
        <div className="alumni-viewjobs-content">
          {/* Header Section */}
          <div className="viewjobs-header">
            <h1>View Posted Jobs</h1>
            <p>All job opportunities you've shared with the community</p>
            <div className="header-actions">
              <div className="jobs-count">
                <span>{jobs.length} Job{jobs.length !== 1 ? 's' : ''} Posted</span>
              </div>
              <button
                className="post-job-btn"
                onClick={() => window.location.href = "/alumni/jobs"}
              >
                <FaPlus /> Post New Job
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="jobs-section">
            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💼</div>
                <h3>No jobs posted yet</h3>
                <p>Start sharing career opportunities with the Walchand community</p>
                <button
                  className="post-job-btn"
                  onClick={() => window.location.href = "/alumni/jobs"}
                >
                  <FaPlus /> Post Your First Job
                </button>
              </div>
            ) : (
              <div className="viewjobs-grid">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card-view">
                    <div className="job-card-header">
                      {job.image ? (
                        <img src={job.image} alt={job.company} className="company-logo" />
                      ) : (
                        <div className="company-logo-placeholder">
                          {job.company?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div className="job-title-section">
                        <h3>{job.title}</h3>
                        <p className="company-name">{job.company}</p>
                        <p className="job-location">
                          <FaMapMarkerAlt /> {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="job-description">
                      <p>{job.description}</p>
                    </div>

                    <div className="job-card-actions">
                      <div className="action-left">
                        {job.link ? (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="apply-btn"
                          >
                            <FaExternalLinkAlt /> Apply Now
                          </a>
                        ) : (
                          <button className="apply-btn disabled">
                            Apply Details
                          </button>
                        )}
                        <span className="post-date">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="action-right">
                        <button
                          className="delete-job-btn"
                          onClick={() => deleteJob(job.id)}
                          title="Delete Job"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniViewJobs;