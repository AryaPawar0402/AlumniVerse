// components/AdminProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { getAdminProfile, updateAdminProfile } from "../services/AdminProfileService";
import Navbar from "../components/Navbar";
import campus from "../assets/wce-campus.jpg";
import { FaCamera } from "react-icons/fa";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getAdminProfile();
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          department: data.department || "",
          role: data.role || "",
          about: data.about || "",
        });
        setAvatarUrl(data.avatar || null);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
  };

  const handleSave = async () => {
    try {
      const updated = await updateAdminProfile({ ...formData, avatar: avatarUrl });
      setProfile(updated);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      department: profile.department,
      role: profile.role,
      about: profile.about,
    });
    setAvatarUrl(profile.avatar || null);
    setIsEditing(false);
    setError("");
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const initials = `${profile?.firstName?.charAt(0) || ""}${profile?.lastName?.charAt(0) || ""}`.toUpperCase() || "A";

  if (loading)
    return (
      <div className="admin-profile-container" style={{ backgroundImage: `url(${campus})` }}>
        <Navbar />
        <div className="admin-profile-overlay">
          <div className="loading-state">
            <p>Loading admin profile...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="admin-profile-container" style={{ backgroundImage: `url(${campus})` }}>
        <Navbar />
        <div className="admin-profile-overlay">
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="admin-profile-container" style={{ backgroundImage: `url(${campus})` }}>
      <Navbar />
      <div className="admin-profile-overlay">
        <div className="admin-profile-card">
          {/* Profile Header */}
          <div className="admin-profile-header">
            {/* Avatar Left */}
            <div className="admin-profile-avatar-wrapper">
              <div className="admin-profile-avatar">
                {avatarUrl ? <img src={avatarUrl} alt="Profile" /> : initials}
              </div>

              {/* Camera Overlay */}
              <div className="change-photo-overlay" onClick={handleAvatarClick}>
                <FaCamera />
              </div>

              {/* Remove Button */}
              {avatarUrl && (
                <div className="remove-profile" onClick={() => setAvatarUrl(null)}>
                  ✕
                </div>
              )}

              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={handleFileChange} 
              />
            </div>

            {/* Title Center */}
            <div className="admin-profile-title-section">
              <h1>Admin Profile</h1>
            </div>

            {/* Edit Button Right */}
            <div className="admin-profile-actions">
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="admin-profile-content">
            <div className="admin-profile-info-grid">
              {/* Personal Info */}
              <div className="info-section">
                <h3>Personal Information</h3>
                <div className="info-item">
                  <span className="info-label">First Name:</span>
                  <span className="info-value">
                    {isEditing ? (
                      <input 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                      />
                    ) : (
                      profile.firstName
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Name:</span>
                  <span className="info-value">
                    {isEditing ? (
                      <input 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                      />
                    ) : (
                      profile.lastName
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">
                    {isEditing ? (
                      <input 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                      />
                    ) : (
                      profile.phone || "Not provided"
                    )}
                  </span>
                </div>
              </div>

              {/* Admin Info */}
              <div className="info-section">
                <h3>Administrative Information</h3>
                <div className="info-item">
                  <span className="info-label">Department:</span>
                  <span className="info-value">
                    {isEditing ? (
                      <input 
                        name="department" 
                        value={formData.department} 
                        onChange={handleChange} 
                      />
                    ) : (
                      profile.department || "Not specified"
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Role:</span>
                  <span className="info-value">
                    {isEditing ? (
                      <input 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange} 
                      />
                    ) : (
                      profile.role || "Administrator"
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">About:</span>
                  <span className="info-value">
                    {isEditing ? (
                      <textarea 
                        name="about" 
                        value={formData.about} 
                        onChange={handleChange} 
                        rows="3" 
                      />
                    ) : (
                      profile.about || "No information provided"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="admin-profile-actions-bottom">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;