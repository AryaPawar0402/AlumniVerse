import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import campus from "../assets/wce-campus.jpg";
import { createEvent } from "../services/adminEventService";
import "./AdminEvents.css";

const AdminEvents = () => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    organizer: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage("❌ Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ Image size should be less than 5MB");
        return;
      }

      setNewEvent({ ...newEvent, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setMessage("✅ Image selected successfully!");
    }
  };

  const removeImage = () => {
    setNewEvent({ ...newEvent, image: null });
    setImagePreview("");
    setMessage("🗑️ Image removed");

    // Safely clear file input
    const fileInput = document.getElementById("eventImage");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.organizer
    ) {
      setMessage("❌ Please fill all required fields");
      return;
    }

    setSubmitting(true);
    setMessage("⏳ Adding event...");

    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.date);
      formData.append("organizer", newEvent.organizer);

      if (newEvent.image) {
        formData.append("image", newEvent.image);
      }

      // Log FormData for debugging
      console.log("📤 Sending event creation request:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`   ${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`   ${key}:`, value);
        }
      }

      // ACTUALLY CALL THE BACKEND API
      const result = await createEvent(formData);

      console.log("✅ Event created successfully:", result);

      setMessage("🎉 Event added successfully! It will appear in View Events page.");

      // Reset form
      setNewEvent({
        title: "",
        description: "",
        date: "",
        organizer: "",
        image: null
      });
      setImagePreview("");

      // Safely clear file input
      const fileInput = document.getElementById("eventImage");
      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      console.error("❌ Error creating event:", err);
      const errorMessage = err.response?.data || err.message || "Failed to add event. Please try again.";
      setMessage("❌ " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="admin-events-container"
      style={{ backgroundImage: `url(${campus})` }}
    >
      <AdminNavbar />
      <div className="admin-events-overlay">
        <div className="admin-events-card">
          <div className="card-header">
            <div className="header-icon">🎉</div>
            <h1>Create New Event</h1>
            <p>Fill in the details below to add a new college event</p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`message ${message.includes("❌") ? "error" : "success"}`}>
              <div className="message-icon">
                {message.includes("❌") ? "❌" : message.includes("⏳") ? "⏳" : "✅"}
              </div>
              {message.replace("❌", "").replace("✅", "").replace("⏳", "").replace("🗑️", "")}
            </div>
          )}

          <form className="event-form" onSubmit={handleSubmit}>
            {/* Event Details */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-icon">📝</span>
                <h3>Event Details</h3>
              </div>

              <div className="input-group">
                <div className="input-icon">🎯</div>
                <input
                  type="text"
                  name="title"
                  placeholder="Event Title *"
                  value={newEvent.title}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="rich-input"
                />
              </div>

              <div className="input-group">
                <div className="input-icon">📄</div>
                <textarea
                  name="description"
                  placeholder="Event Description *"
                  value={newEvent.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  disabled={submitting}
                  className="rich-textarea"
                />
              </div>
            </div>

            {/* Event Schedule */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-icon">📅</span>
                <h3>Event Schedule</h3>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <div className="input-icon">📆</div>
                  <input
                    type="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="rich-input"
                  />
                </div>

                <div className="input-group">
                  <div className="input-icon">👤</div>
                  <input
                    type="text"
                    name="organizer"
                    placeholder="Organizer *"
                    value={newEvent.organizer}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="rich-input"
                  />
                </div>
              </div>
            </div>

            {/* Event Media */}
            <div className="form-section">
              <div className="section-header">
                <span className="section-icon">🖼️</span>
                <h3>Event Media</h3>
              </div>

              <div className="file-upload-container">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Event preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeImage}
                      disabled={submitting}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ) : (
                  <div className="file-upload-area">
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">
                      <p>Click to upload event image</p>
                      <span>PNG, JPG, JPEG (Max 5MB)</span>
                    </div>
                    <input
                      type="file"
                      id="eventImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={submitting}
                      className="file-input"
                    />
                  </div>
                )}
              </div>

              <div className="input-hint">
                💡 Upload a high-quality image for better event presentation
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                <span className="button-icon">
                  {submitting ? "⏳" : "🚀"}
                </span>
                <span className="button-text">
                  {submitting ? "Adding Event..." : "Publish Event"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;