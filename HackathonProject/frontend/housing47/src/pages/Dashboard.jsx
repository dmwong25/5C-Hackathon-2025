import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roommates, setRoommates] = useState([]);
  const [roomData, setRoomData] = useState(null);
  let userId = null;


  useEffect(() => {
    // Get the userId from localStorage
    userId = localStorage.getItem("userId");

    if (!userId) {
      // No user ID found, redirect to sign in
      navigate("/signin");
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://backend-housing47.onrender.comusers/get_user/${userId}`);
        setUserData(response.data);
        setGroupId(response.data.group_id);

        // Fetch room details if the user has a room assignment
        if (response.data.room_id) {
          try {
            const roomResponse = await axios.get(`https://backend-housing47.onrender.comrooms/get_room_by_id/${response.data.room_id}`);
            setRoomData(roomResponse.data);
          } catch (roomErr) {
            console.error("Error fetching room data:", roomErr);
          }
        }

        // Try to fetch roommates if the user has a group
        if (response.data.group_id) {
          try {
            const roommatesResponse = await axios.get(`https://backend-housing47.onrender.comusers/roommates/${userId}`);
            if (roommatesResponse.data && roommatesResponse.data.roommates) {
              setRoommates(roommatesResponse.data.roommates);
            }
          } catch (err) {
            console.error("Error fetching roommates:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId");
    // Redirect to home page
    navigate("/");
  };

  const handleLeaveGroup = async () => {
    userId = localStorage.getItem("userId");

    try {
      console.log("user id", userId)
      const response = await axios.post(`https://backend-housing47.onrender.comusers/leaveGroup/${userId}`);
      console.log("Successfully left group:", response.data);

      const userResponse = await axios.get(`https://backend-housing47.onrender.comusers/get_user/${userId}`);
      setUserData(userResponse.data)
      setGroupId(userResponse.data.group_id);
    } catch (error) {
      console.error("Error leaving group:", error.message);
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>Housing47</span>
        </div>
        <div style={styles.navLinks}>
          <button style={{...styles.navLink, ...styles.activeNavLink}}>Dashboard</button>
          <button onClick={() => navigate("/map")} style={styles.navLink}>Browse Housing</button>
          <button onClick={() => navigate("/users")} style={styles.navLink}>Find Roommates</button>
          <button onClick={handleSignOut} style={styles.signOutButton}>Sign Out</button>
        </div>
      </header>

      <main style={styles.mainContent}>
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {userData && (
          <div style={styles.dashboardContainer}>
            <div style={styles.welcomeSection}>
              <h1 style={styles.welcomeHeading}>Welcome, {userData.username}!</h1>
              <p style={styles.welcomeSubheading}>
                Here's your housing dashboard
              </p>
            </div>

            <div style={styles.infoCards}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Your Profile</h2>
                <div style={styles.cardContent}>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Class Year:</strong> {getClassYearName(userData.class_year)}</p>
                  <p><strong>Housing Status:</strong> {userData.room_id ? "Assigned" : "Not Assigned"}</p>
                </div>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Roommate Group</h2>
                <div style={styles.cardContent}>
                  {groupId ? (
                    <>
                      <p><strong>Group ID:</strong> {groupId}</p>
                      <p><strong>Roommates:</strong></p>
                      {roommates.length > 0 ? (
                        <>
                          <ul style={styles.roommateList}>
                            {roommates.map(roommate => (
                              <li key={roommate.id} style={styles.roommateItem}>
                                {roommate.username} ({getClassYearName(roommate.class_year)})
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={handleLeaveGroup}
                            style={styles.actionButton}>Leave Group</button>
                        </>

                      ) : (
                        <>
                          <p>No roommates found</p>
                        </>

                      )}
                    </>
                  ) : (
                    <>
                      <p>You are not part of a roommate group yet. Create or join a group to find housing together.</p>
                      <button
                        onClick={() => navigate("/users")}
                        style={styles.actionButton}>Find Roommate</button>
                    </>

                  )}
                </div>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Housing Assignment</h2>
                <div style={styles.cardContent}>
                  {userData.room_id ? (
                    <>
                      {roomData ? (
                        <div>
                          <p><strong>Room:</strong> {roomData.room_number}</p>
                          <p><strong>Building:</strong> {roomData.building_id}</p>
                          <p><strong>Capacity:</strong> {roomData.capacity} {roomData.capacity === 1 ? 'person' : 'people'}</p>
                          {roomData.has_ac && <p><strong>Amenities:</strong> Air Conditioning</p>}
                        </div>
                      ) : (
                        <p>Loading room information...</p>
                      )}
                    </>
                  ) : (
                    <p>You don't have a housing assignment yet.</p>
                  )}
                  <button
                    onClick={() => navigate("/map")}
                    style={styles.actionButton}>Browse Housing Map</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2025 Housing47. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Helper function to convert class year number to name
function getClassYearName(classYear) {
  const classYearMap = {
    "1": "Freshman",
    "2": "Sophomore",
    "3": "Junior",
    "4": "Senior"
  };

  return classYearMap[classYear] || classYear;
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#4F46E5',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    color: '#4B5563',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  signOutButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    color: '#EF4444',
    fontWeight: '500',
    background: 'none',
    border: '1px solid #EF4444',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  activeNavLink: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  welcomeSection: {
    marginBottom: '1rem',
  },
  welcomeHeading: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  welcomeSubheading: {
    fontSize: '1.125rem',
    color: '#6B7280',
  },
  infoCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cardTitle: {
    backgroundColor: '#F3F4F6',
    padding: '1rem',
    borderBottom: '1px solid #E5E7EB',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  cardContent: {
    padding: '1.5rem',
    color: '#4B5563',
  },
  roommateList: {
    listStyleType: 'none',
    padding: 0,
    margin: '0.5rem 0 0 0',
  },
  roommateItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #F3F4F6',
  },
  actionButton: {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: '500',
    fontSize: '0.875rem',
    padding: '0.625rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem',
  },
  footer: {
    borderTop: '1px solid #E5E7EB',
    padding: '1.5rem',
    textAlign: 'center',
    color: '#6B7280',
    backgroundColor: 'white',
  },
  errorMessage: {
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #EF4444',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#6B7280',
  },
  loadingSpinner: {
    width: '2.5rem',
    height: '2.5rem',
    border: '4px solid #E5E7EB',
    borderTopColor: '#4F46E5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};