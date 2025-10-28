import React, { useEffect, useState, useRef } from "react";
import AlumniNavbar from "../components/AlumniNavbar";
import campus from "../assets/wce-campus.jpg";
import { FaPlus, FaImage, FaMapMarkerAlt, FaBuilding, FaLink, FaEye } from "react-icons/fa";
import "./AlumniJobs.css";

const AlumniJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    link: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('alumniPostedJobs');
    if (savedJobs) {
      const parsedJobs = JSON.parse(savedJobs);
      if (Array.isArray(parsedJobs)) {
        setJobs(parsedJobs);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new job object
    const newJob = {
      id: `job-${Date.now()}`,
      title: formData.title,
      company: formData.company,
      location: formData.location,
      description: formData.description,
      link: formData.link,
      image: imagePreview,
      createdAt: new Date().toISOString(),
      postedBy: "Alumni"
    };

    // Update jobs state and localStorage
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem('alumniPostedJobs', JSON.stringify(updatedJobs));

    // Reset form
    setFormData({
      title: "",
      company: "",
      location: "",
      description: "",
      link: "",
      image: null
    });
    setImagePreview(null);
    setShowJobForm(false);

    alert("Job posted successfully!");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="alumni-jobs-container" style={{ backgroundImage: `url(${campus})` }}>
      <AlumniNavbar />

      <div className="alumni-jobs-overlay">
        <div className="alumni-jobs-content">
          {/* Header Section */}
          <div className="jobs-header">
            <h1>Post Job Opportunities</h1>
            <p>Share career opportunities with the Walchand community</p>
            <div className="header-actions">
              <button
                className="post-job-btn"
                onClick={() => setShowJobForm(true)}
              >
                <FaPlus /> Post a Job
              </button>
              {jobs.length > 0 && (
                <button
                  className="view-jobs-btn"
                  onClick={() => window.location.href = "/alumni/view-jobs"}
                >
                  <FaEye /> View Jobs ({jobs.length})
                </button>
              )}
            </div>
          </div>

          {/* Job Posting Form Modal */}
          {showJobForm && (
            <div className="modal-overlay">
              <div className="job-form-modal">
                <div className="modal-header">
                  <h2>Post a New Job</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowJobForm(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="job-form">
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label><FaBuilding /> Company *</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><FaMapMarkerAlt /> Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Pune, Maharashtra"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Job Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the role, requirements, and benefits..."
                      rows="5"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaLink /> Application Link</label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="https://company.com/careers"
                    />
                  </div>

                  <div className="form-group">
                    <label>Company/Job Image</label>
                    <div className="image-upload-section">
                      <button
                        type="button"
                        className="image-upload-btn"
                        onClick={triggerFileInput}
                      >
                        <FaImage /> Choose Image
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      {imagePreview && (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setShowJobForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      Post Job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniJobs;