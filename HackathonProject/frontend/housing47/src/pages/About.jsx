import React from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>Housing47</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => navigate("/")}>Home</button>
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.aboutContainer}>
          <h1 style={styles.pageTitle}>About Housing47</h1>
          
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Our Mission</h2>
            <div style={styles.missionBox}>
              <p style={styles.missionText}>
                Housing47 aims to transform the housing selection experience at Pomona College by reducing stress and anxiety, 
                preventing the destruction of friendships, and creating a more intuitive and well-designed user experience that 
                promotes collaboration among community members.
              </p>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>The Problem We're Solving</h2>
            <p>
              The current Residence website is difficult to navigate and functionally limited. Finding dorm maps involves unnecessary 
              friction, and planning your housing selection with friends using the current system creates stress and anxiety.
            </p>
            <p>
              Housing selection often requires students to be "in the know" and rely on anecdotal information from upperclassmen, 
              creating inequity in the process. We believe all students deserve fair and informed access to housing information.
            </p>
          </section>

          <section style={styles.section}>
            <div style={styles.twoColumnLayout}>
              <div style={styles.column}>
                <h2 style={styles.sectionTitle}>How It Works</h2>
                <ul style={styles.featureList}>
                  <li>
                    <span style={styles.featureIcon}>🗺️</span>
                    <span style={styles.featureText}>
                      <strong>Interactive Maps:</strong> Explore dorms with intuitive floor plans
                    </span>
                  </li>
                  <li>
                    <span style={styles.featureIcon}>🔍</span>
                    <span style={styles.featureText}>
                      <strong>Smart Filtering:</strong> Find rooms by floor, type, AC status, capacity, and class year eligibility
                    </span>
                  </li>
                  <li>
                    <span style={styles.featureIcon}>👥</span>
                    <span style={styles.featureText}>
                      <strong>Group Management:</strong> Create and manage roommate groups easily
                    </span>
                  </li>
                  <li>
                    <span style={styles.featureIcon}>🔒</span>
                    <span style={styles.featureText}>
                      <strong>Privacy Protection:</strong> Room draw times are kept private within groups to prevent coercion
                    </span>
                  </li>
                </ul>
              </div>
              <div style={styles.column}>
                <h2 style={styles.sectionTitle}>Our Technology</h2>
                <div style={styles.techStack}>
                  <div style={styles.techCategory}>
                    <h3 style={styles.techTitle}>Frontend</h3>
                    <ul style={styles.techList}>
                      <li>React JS</li>
                      <li>HTML/CSS</li>
                      <li>Maptiler API</li>
                      <li>Figma (Design)</li>
                    </ul>
                  </div>
                  <div style={styles.techCategory}>
                    <h3 style={styles.techTitle}>Backend</h3>
                    <ul style={styles.techList}>
                      <li>JavaScript</li>
                      <li>Firebase</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ethical Considerations</h2>
            <div style={styles.ethicsBox}>
              <p>
                <strong>Privacy:</strong> Room draw times are kept private (only seen amongst groupmates) to prevent coercion of students with good draw times.
              </p>
              <p>
                <strong>Equity:</strong> By making information more accessible and easy to understand, we ensure that all students have fair and informed access to housing, 
                not just those with connections to upperclassmen.
              </p>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>The Future of Housing47</h2>
            <div style={styles.futureBox}>
              <ul style={styles.futureList}>
                <li>Integration with the current Residence system to allow room selection directly through Housing47</li>
                <li>Support for joining multiple groups with different numbers of people for contingency planning</li>
                <li>Implementation of all dorms with high-quality floor plans</li>
                <li>Additional features based on student feedback and needs</li>
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Our Team</h2>
            <p style={styles.teamDescription}>
              Housing47 was created by a team of Pomona College students who experienced firsthand the challenges of the housing selection process. 
              Our team includes both freshmen experiencing the process for the first time and seniors who have navigated it multiple times.
            </p>
            <div style={styles.makerInfo}>
              <span style={styles.makerBadge}>Maker Track Project</span>
              <span style={styles.overlayBadge}>5C Community Overlay</span>
            </div>
          </section>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2025 Housing47. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoIcon: {
    fontSize: "1.5rem",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "#4F46E5",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  navLink: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    color: "#4B5563",
    fontWeight: "500",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.2s",
  },
  signOutButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    color: "#EF4444",
    fontWeight: "500",
    background: "none",
    border: "1px solid #EF4444",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.2s",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
  },
  aboutContainer: {
    maxWidth: "1000px",
    width: "100%",
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: "2rem",
    textAlign: "center",
  },
  section: {
    marginBottom: "3rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1rem",
    borderBottom: "2px solid #E5E7EB",
    paddingBottom: "0.5rem",
  },
  missionBox: {
    backgroundColor: "#EEF2FF",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    borderLeft: "5px solid #4F46E5",
  },
  missionText: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    margin: 0,
    color: "#1E40AF",
  },
  twoColumnLayout: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  column: {
    flex: "1 1 400px",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  featureIcon: {
    fontSize: "1.5rem",
    marginRight: "0.75rem",
    display: "inline-block",
    verticalAlign: "middle",
  },
  featureText: {
    display: "inline-block",
    verticalAlign: "middle",
  },
  techStack: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  techCategory: {
    flex: 1,
    minWidth: "180px",
  },
  techTitle: {
    fontSize: "1.1rem",
    color: "#4B5563",
    marginBottom: "0.5rem",
  },
  techList: {
    margin: 0,
    paddingLeft: "1.5rem",
  },
  ethicsBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    borderLeft: "5px solid #10B981",
  },
  futureBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: "0.75rem",
    padding: "1.5rem",
  },
  futureList: {
    margin: 0,
    paddingLeft: "1.5rem",
  },
  teamDescription: {
    marginBottom: "1.5rem",
  },
  makerInfo: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  makerBadge: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    padding: "0.5rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  overlayBadge: {
    backgroundColor: "#E0E7FF",
    color: "#4338CA",
    padding: "0.5rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  footer: {
    borderTop: "1px solid #E5E7EB",
    padding: "1rem",
    textAlign: "center",
    color: "#6B7280",
    backgroundColor: "white",
    fontSize: "0.875rem",
  },
};

export default AboutPage;