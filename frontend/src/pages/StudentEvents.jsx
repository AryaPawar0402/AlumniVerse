import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import campus from "../assets/wce-campus.jpg";
import { getAllEvents } from "../services/adminEventService"; // Use your existing service
import "./StudentEvents.css";

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      console.log("🔄 Student: Fetching events...");
      setError(null);

      const data = await getAllEvents();
      console.log("✅ Student: Events data received:", data);

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Student: Error fetching events:", err);
      setError("Failed to load events. Please check your connection and try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Invalid date";
    }
  };

  // Function to handle image display
  const getEventImage = (event) => {
    if (event.imageUrl) {
      // If it's Base64, use it directly
      if (event.imageUrl.startsWith('data:image/')) {
        return event.imageUrl;
      }

      // If it's a file path, try it
      if (event.imageUrl.startsWith('/uploads/')) {
        const absoluteUrl = `http://localhost:8080${event.imageUrl}?t=${new Date().getTime()}`;
        return absoluteUrl;
      }

      return event.imageUrl;
    }

    return null;
  };

  const handleImageError = (e, event) => {
    console.log(`❌ Image failed to load for event: "${event.title}"`);
    e.target.style.display = 'none';

    // Show the placeholder
    const container = e.target.parentElement;
    const placeholder = container.querySelector('.event-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  const handleImageLoad = (e, event) => {
    console.log(`✅ Image loaded successfully for event: "${event.title}"`);

    // Hide the placeholder when image loads successfully
    const container = e.target.parentElement;
    const placeholder = container.querySelector('.event-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  };

  return (
    <div className="student-events-container" style={{ backgroundImage: `url(${campus})` }}>
      <Navbar />
      <div className="student-events-overlay">
        <div className="student-events-card">
          <div className="student-events-header">
            <h1> Upcoming College Events</h1>
            <p>Stay updated with all the latest events happening in our college</p>
          </div>

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
              <button
                className="retry-btn"
                onClick={fetchEvents}
              >
                🔄 Retry
              </button>
            </div>
          )}

          {loading ? (
            <p className="loading-view">📦 Loading events...</p>
          ) : events.length === 0 && !error ? (
            <p className="empty-state-view">📭 No upcoming events. Check back later!</p>
          ) : (
            <div>
              <p className="events-count">📊 Found {events.length} upcoming event{events.length !== 1 ? 's' : ''}</p>
              <div className="events-grid-view">
                {events.map((event, index) => {
                  const imageUrl = getEventImage(event);
                  const hasImage = !!imageUrl;

                  return (
                    <div key={event.id || index} className="event-card-view">
                      <div className="event-image-container">
                        {/* Always show placeholder initially */}
                        <div
                          className="event-image-placeholder"
                          style={hasImage ? {} : {display: 'flex'}}
                        >
                          <div className="placeholder-icon">📅</div>
                          <div className="placeholder-text">{event.title || "Event"}</div>
                        </div>

                        {/* Show image if available */}
                        {hasImage && (
                          <img
                            src={imageUrl}
                            alt={event.title || "Event"}
                            className="event-image"
                            onError={(e) => handleImageError(e, event)}
                            onLoad={(e) => handleImageLoad(e, event)}
                            style={{ display: 'block' }}
                          />
                        )}
                      </div>

                      <div className="event-content-view">
                        <h4>{event.title || "Untitled Event"}</h4>
                        <p className="event-date-view">📅 {formatDate(event.date)}</p>
                        <p className="event-description-view">{event.description || "No description available"}</p>
                        <p className="event-organizer-view">👤 Organized by: {event.organizer || "Unknown"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEvents;