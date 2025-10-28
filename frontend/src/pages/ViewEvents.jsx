import React, { useEffect, useState } from "react";
import { getAllEvents } from "../services/adminEventService";
import AdminNavbar from "../components/AdminNavbar";
import campus from "../assets/wce-campus.jpg";
import "./ViewEvents.css";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      console.log("🔄 Starting to fetch events...");
      setError(null);

      const data = await getAllEvents();
      console.log("✅ Final events data received:", data);

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
      setError(err.message || "Failed to load events. Please check your connection and try again.");
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
    <div className="view-events-container" style={{ backgroundImage: `url(${campus})` }}>
      <AdminNavbar />
      <div className="view-events-overlay">
        <div className="view-events-card">
          <div className="view-events-header">
            <div>
              <h1>All College Events</h1>
              <p>Here are all the events organized in the college</p>
            </div>
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="refresh-btn"
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Events'}
            </button>
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
            <p className="empty-state-view">📭 No events available. Create some events first!</p>
          ) : (
            <div>
              <p className="events-count">📊 Showing {events.length} event{events.length !== 1 ? 's' : ''}</p>
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

export default ViewEvents;