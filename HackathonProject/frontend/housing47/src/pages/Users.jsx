import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserCard from '../components/UserCard';
import { toast } from 'react-toastify';


export default function Users() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [groupId, setGroupId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    let userId;


    useEffect(() => {
        userId = localStorage.getItem("userId");

        if (!userId) {
            navigate("/signin");
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);

                // Get current user
                const response = await axios.get(`https://backend-housing47.onrender.comusers/get_user/${userId}`);
                // Get available users
                const availableResponse = await axios.get(`https://backend-housing47.onrender.comusers/available/${userId}`);
                setAvailableUsers(availableResponse.data);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load your profile or available users. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleAddToGroup = async (roommateId) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                navigate("/signin");
                return;
            }

            const response = await axios.post("https://backend-housing47.onrender.comusers/addToGroup", {
                currId: userId,
                roommateId: roommateId
            });

            if (response.status === 200) {
                // Update state to reflect the changes
                setGroupId(response.data.group_id);

                // Refresh the user data
                const updatedResponse = await axios.get(`https://backend-housing47.onrender.comusers/get_user/${userId}`);
                setUserData(updatedResponse.data);

                // Update the available users list
                const updatedUsersResponse = await axios.get('https://backend-housing47.onrender.comusers');
                setAllUsers(updatedUsersResponse.data);

                // Filter out users who now have a group
                const filteredUsers = updatedUsersResponse.data.filter(user =>
                    !user.group_id && user.id !== userId
                );
                setAvailableUsers(filteredUsers);

                // Show success message
                toast.success("Successfully added to group!");
            }
        } catch (err) {
            console.error("Error adding user to group:", err);
            setError("Failed to add user to your group. Please try again.");
        }
    };

    const handleSignOut = () => {
        // Clear user data from localStorage
        localStorage.removeItem("userId");
        // Redirect to home page
        navigate("/");
    };

    const handleLeaveGroup = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                navigate("/signin");
                return;
            }

            const response = await axios.post(`https://backend-housing47.onrender.comusers/leaveGroup/${userId}`);

            if (response.status === 200) {
                // Update state to reflect the changes
                setGroupId(null);

                // Refresh user data
                const updatedResponse = await axios.get(`https://backend-housing47.onrender.comusers/get_user/${userId}`);
                setUserData(updatedResponse.data);

                // Show success message
                toast("Successfully left the group!");
            }
        } catch (err) {
            console.error("Error leaving group:", err);
            setError("Failed to leave the group. Please try again.");
        }
    };



    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p>Loading profiles...</p>
            </div>
        );
    }

    // Get current roommates if in a group
    const roommates = allUsers.filter(user =>
        user.group_id === groupId && user.id !== localStorage.getItem("userId")
    );

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.logoContainer}>
                    <span style={styles.logoIcon}>🏠</span>
                    <span style={styles.logoText}>Housing47</span>
                </div>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate("/dashboard")} style={styles.navLink}>Dashboard</button>
                    <button onClick={() => navigate("/map")} style={styles.navLink}>Browse Housing</button>
                    <button style={{...styles.navLink, ...styles.activeNavLink}}>Find Roommates</button>
                    <button onClick={handleSignOut} style={styles.signOutButton}>Sign Out</button>
                </div>
            </header>

            <main style={styles.mainContent}>
                {error && (
                    <div style={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div style={styles.dashboardContainer}>
                    {/* My Group Section */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>My Roommate Group</h2>
                        <div style={styles.cardContent}>
                            {groupId ? (
                                <>
                                    <p>Group ID: {groupId}</p>
                                    <p>My Roommates:</p>
                                    {roommates.length > 0 ? (
                                        <ul style={styles.roommateList}>
                                            {roommates.map(roommate => (
                                                <li key={roommate.id} style={styles.roommateItem}>
                                                    {roommate.username} - {getClassYearName(roommate.class_year)}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No roommates yet. Add some below!</p>
                                    )}
                                    <button
                                        style={{ ...styles.actionButton, backgroundColor: '#EF4444' }}
                                        onClick={handleLeaveGroup}
                                    >
                                        Leave Group
                                    </button>
                                </>
                            ) : (
                                <p>You're not part of any roommate group yet. Start by adding potential roommates below!</p>
                            )}
                        </div>
                    </div>

                    {/* Find Roommates Section */}
                    <div style={styles.welcomeSection}>
                        <h1 style={styles.welcomeHeading}>Find your next roommate!</h1>
                        <p style={styles.welcomeSubheading}>
                            Browse through available users and add them to your roommate group
                        </p>
                    </div>

                    <div style={styles.infoCards}>
                        {availableUsers.length > 0 ? (
                            availableUsers.map((user) => (
                                <div key={user.id} style={styles.card}>
                                    <div style={styles.cardContent}>
                                        <h3 style={styles.userName}>{user.username}</h3>
                                        <p>Email: {user.email}</p>
                                        <p>Class Year: {getClassYearName(user.class_year)}</p>
                                        <button
                                            style={styles.actionButton}
                                            onClick={() => handleAddToGroup(user.id)}
                                        >
                                            Add to My Group
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={styles.noUsersMessage}>No available users found. Check back later!</p>
                        )}
                    </div>
                </div>
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
        1: "Freshman",
        2: "Sophomore",
        3: "Junior",
        4: "Senior"
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
    dashboardContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    welcomeSection: {
        marginBottom: '1rem',
        marginTop: '2rem',
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
        margin: '0.5rem 0 1rem 0',
    },
    roommateItem: {
        padding: '0.5rem 0',
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    activeNavLink: {
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
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
    userName: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#111827',
        marginTop: 0,
        marginBottom: '0.75rem',
    },
    noUsersMessage: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        color: '#6B7280',
    }
};