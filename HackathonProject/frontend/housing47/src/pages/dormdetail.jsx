import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DormDetail = () => {
  const navigate = useNavigate();
  const { dormId } = useParams();
  const [tooltipInfo, setTooltipInfo] = useState("");
  const [tooltipRoom, setTooltipRoom] = useState(null);
  const [tooltipLoading, setTooltipLoading] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const imageRef = useRef(null);

  // Room data states
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterClassYear, setFilterClassYear] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("available");
  const [filterAC, setFilterAC] = useState(""); // New AC filter
  const [filterEligibility, setFilterEligibility] = useState("all"); // New eligibility filter

  // User data
  const [userId, setUserId] = useState(null);
  const [userClassYear, setUserClassYear] = useState(null);
  const [groupSize, setGroupSize] = useState(0);
  const dormImages = {
    "harwood-court": "/images/harwood-court-1.jpg",
    "clark-i": "/images/clark-i.jpg",
    "sontag-hall": "/images/sontag-hall.jpg",
    "mudd-blaisdell-hall": "/images/mudd-blaisdell-hall.jpg",
    // Add all your dorms here
  };
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(); // you can customize format if needed
  };
  // Define image maps for each dorm
  const dormMaps = {
    "harwood-court": [
      { coords: "228,424,163,372", roomId: "HAR_109", info: "Room 109" },
      { coords: "246,519,308,574", roomId: "HAR_104", info: "Room 104" },
      { coords: "209,520,233,575", roomId: "HAR_101", info: "Room 101" },
      { coords: "246,477,298,513", roomId: "HAR_102", info: "Room 102" },
      { coords: "248,449,299,473", roomId: "HAR_106", info: "Room 106" },
      { coords: "296,419,249,387", roomId: "HAR_108", info: "Room 108" },
      { coords: "177,340,227,370", roomId: "HAR_111", info: "Room 111" },
      { coords: "247,359,295,386", roomId: "HAR_110", info: "Room 110" },
      { coords: "180,308,227,340", roomId: "HAR_113", info: "Room 113" },
      { coords: "248,289,295,320", roomId: "HAR_114", info: "Room 114" },
      { coords: "175,244,224,273", roomId: "HAR_117", info: "Room 117" },
      { coords: "247,261,281,288", roomId: "HAR_116", info: "Room 116" },
      { coords: "175,215,225,243", roomId: "HAR_119", info: "Room 119" },
      { coords: "298,261,265,215", roomId: "HAR_120", info: "Room 120" },
      { coords: "222,123,253,163", roomId: "HAR_123", info: "Room 123" },
      { coords: "285,161,256,125", roomId: "HAR_125", info: "Room 125" },
      { coords: "312,143,346,192", roomId: "HAR_127", info: "Room 127" },
      { coords: "594,123,625,171", roomId: "HAR_145", info: "Room 145" },
      { coords: "656,124,627,170", roomId: "HAR_147", info: "Room 147" },
      { coords: "595,225,625,267", roomId: "HAR_142", info: "Room 142" },
      { coords: "656,265,627,227", roomId: "HAR_144", info: "Room 144" },
      { coords: "660,263,707,290", roomId: "HAR_162", info: "Room 162" },
      { coords: "656,293,706,320", roomId: "HAR_164", info: "Room 164" },
      { coords: "728,278,782,303", roomId: "HAR_163", info: "Room 163" },
      { coords: "727,306,777,336", roomId: "HAR_165", info: "Room 165" },
      { coords: "729,340,779,368", roomId: "HAR_167", info: "Room 167" },
      { coords: "657,362,706,391", roomId: "HAR_168", info: "Room 168" },
      { coords: "657,393,708,419", roomId: "HAR_170", info: "Room 170" },
      { coords: "726,407,778,440", roomId: "HAR_171", info: "Room 171" },
      { coords: "658,452,705,480", roomId: "HAR_172", info: "Room 172" },
      { coords: "728,441,776,464", roomId: "HAR_173", info: "Room 173" },
      { coords: "728,467,777,494", roomId: "HAR_175", info: "Room 175" },
      { coords: "660,483,705,507", roomId: "HAR_174", info: "Room 174" },
      { coords: "728,497,776,524", roomId: "HAR_176", info: "Room 176" },
      { coords: "708,544,661,513", roomId: "HAR_177", info: "Room 177" },
      { coords: "727,528,777,566", roomId: "HAR_179", info: "Room 179" },
      { coords: "659,549,691,595", roomId: "HAR_178", info: "Room 178" },
      { coords: "726,567,777,593", roomId: "HAR_181", info: "Room 181" },
      { coords: "582,575,617,608", roomId: "HAR_180", info: "Room 180" },
      { coords: "583,612,628,640", roomId: "HAR_182", info: "Room 182" },
      { coords: "662,612,706,640", roomId: "HAR_184", info: "Room 184" },
      { coords: "727,597,778,626", roomId: "HAR_183", info: "Room 183" },
      { coords: "776,665,729,628", roomId: "HAR_187", info: "Room 187" },
      { coords: "705,680,745,708", roomId: "HAR_185", info: "Room 185" },
      { coords: "750,667,775,707", roomId: "HAR_189", info: "Room 189" },
    ]
  };

  const image = dormImages[dormId];
  const mapData = dormMaps[dormId] || [];

  // New validation function for room eligibility
  const isRoomEligible = (room) => {
    return !room.is_taken && room.class_year <= userClassYear && room.capacity === groupSize;
  };

  // Get eligibility status with reason
  const getRoomEligibilityStatus = (room) => {
    if (room.is_taken) {
      return { eligible: false, reason: "taken" };
    }

    const classYearMet = room.class_year <= userClassYear;
    const capacityMatched = room.capacity === groupSize;

    if (classYearMet && capacityMatched) {
      return { eligible: true, reason: "eligible" };
    } else if (!classYearMet && capacityMatched) {
      return { eligible: false, reason: "class_year" };
    } else if (classYearMet && !capacityMatched) {
      return { eligible: false, reason: "capacity" };
    } else {
      return { eligible: false, reason: "both" };
    }
  };

  // Function to fetch detailed room info for tooltip
  const fetchRoomDetails = async (roomId) => {
    setTooltipLoading(true);
    try {
      const response = await axios.get(`https://backend-housing47.onrender.com//rooms/get_room_by_id/${roomId}`);
      setTooltipRoom(response.data);
      setTooltipLoading(false);
    } catch (error) {
      console.error("Error fetching room details:", error);
      setTooltipLoading(false);
    }
  };

  // Load user data and room data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Get userId from localStorage
        const storedUserId = localStorage.getItem("userId");
        console.log("Stored userId:", storedUserId);
        if (!storedUserId) {
          navigate("/signin");
          return;
        }

        setUserId(storedUserId);

        // Fetch user data to get class year and group info
        const userResponse = await axios.get(`https://backend-housing47.onrender.com/users/get_user/${storedUserId}`);
        const userData = userResponse.data;
        setUserClassYear(typeof userData.class_year === 'string' ?
          parseInt(userData.class_year, 10) :
          userData.class_year);
        console.log("User class year:", userData.class_year);

        // Fetch roommates to determine group size
        if (userData.group_id) {
          const roommatesResponse = await axios.get(`https://backend-housing47.onrender.com/users/roommates/${storedUserId}`);
          console.log("Roommates response:", roommatesResponse.data);
          setGroupSize(roommatesResponse.data.roommates.length);
          console.log("Group size:", roommatesResponse.data.roommates.length);
        } else {
          setGroupSize(1); // Just the user if no roommates
          console.log("No roommates, group size set to 1");
        }

        // Fetch all rooms
        const roomsResponse = await axios.get("https://backend-housing47.onrender.com/rooms");
        const roomsData = roomsResponse.data;
        console.log("Total rooms fetched:", roomsData.length);

        // Filter rooms for this dorm only (assuming rooms have a dorm_id field)
        const dormRooms = roomsData.filter(room => room.building_id === "HARWOOD");
        console.log("Rooms for this dorm:", dormRooms.length);

        // Set some rooms as taken for testing if needed
        const updatedRooms = dormRooms.map(room => {
          // Add is_taken flag for testing based on existing data
          if (!('is_taken' in room)) {
            return { ...room, is_taken: Math.random() > 0.7 }; // Randomly set 30% as taken
          }
          return room;
        });

        // Check for taken rooms
        const takenRooms = updatedRooms.filter(room => room.is_taken);
        console.log(`Found ${takenRooms.length} taken rooms in data`);

        // Set the room data
        setAllRooms(updatedRooms);

        // Try to get filtered rooms, but don't break if it fails
        try {
          const filteredRoomsResponse = await axios.get(`https://backend-housing47.onrender.com/rooms/filtered/${storedUserId}`);
          const filteredDormRooms = filteredRoomsResponse.data.filter(room => room.building_id === "HARWOOD");
          console.log("Filtered rooms:", filteredDormRooms.length);
          setFilteredRooms(filteredDormRooms);
        } catch (filterErr) {
          console.warn("Could not get filtered rooms:", filterErr);
          // Just use all available rooms instead
          const availableRooms = updatedRooms.filter(room => !room.is_taken);
          console.log("Using available rooms as fallback:", availableRooms.length);
          setFilteredRooms(availableRooms);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load room data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dormId, navigate]);

  // Apply manual filters on top of API filtered rooms
  useEffect(() => {
    if (allRooms.length === 0) return;

    let filtered = [...allRooms];

    // Filter by availability
    if (filterAvailability === "available") {
      filtered = filtered.filter(room => !room.is_taken);
    } else if (filterAvailability === "taken") {
      filtered = filtered.filter(room => room.is_taken);
    }

    // Filter by capacity
    if (filterCapacity) {
      filtered = filtered.filter(room => room.capacity === parseInt(filterCapacity));
    }

    // Filter by class year
    if (filterClassYear) {
      filtered = filtered.filter(room => room.class_year === parseInt(filterClassYear));
    }

    // Filter by AC
    if (filterAC === "yes") {
      filtered = filtered.filter(room => room.has_ac === true);
    } else if (filterAC === "no") {
      filtered = filtered.filter(room => room.has_ac === false);
    }

    // Filter by eligibility
    if (filterEligibility === "eligible") {
      filtered = filtered.filter(room => isRoomEligible(room));
    } else if (filterEligibility === "ineligible") {
      filtered = filtered.filter(room => !isRoomEligible(room) && !room.is_taken);
    }

    setFilteredRooms(filtered);
  }, [filterAvailability, filterCapacity, filterClassYear, filterAC, filterEligibility, allRooms, groupSize, userClassYear]);

  // Create room overlay elements for the floorplan
  const renderRoomOverlays = () => {

    // Don't try to render if we don't have room data yet
    if (allRooms.length === 0) {
      console.log("No room data available yet - skipping overlay rendering");
      return null;
    }

    // Create overlays for all map areas
    return mapData.map((area, index) => {
      // Find the matching room from API data by matching room_number with roomId
      const roomInfo = allRooms.find(room => room.room_number === area.roomId);

      if (!roomInfo) {
        console.log(`No room info found for area ${area.roomId}`);
        return null;
      }

      // Check the eligibility status
      const eligibilityStatus = getRoomEligibilityStatus(roomInfo);

      // Parse coordinates from string like "228,424,163,372"
      const coordsArray = area.coords.split(',').map(Number);

      // Get the values for the rectangle corners
      const x1 = parseInt(coordsArray[0]);
      const y1 = parseInt(coordsArray[1]);
      const x2 = parseInt(coordsArray[2]);
      const y2 = parseInt(coordsArray[3]);

      // Determine the top left corner and dimensions
      const x = Math.min(x1, x2);
      const y = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      // Set color based on room eligibility
      let backgroundColor, borderColor;

      if (roomInfo.is_taken) {
        // Red for taken
        backgroundColor = 'rgba(248, 113, 113, 0.6)';
        borderColor = 'rgba(220, 38, 38, 0.8)';
      } else if (eligibilityStatus.eligible) {
        // Green for eligible
        backgroundColor = 'rgba(74, 222, 128, 0.6)';
        borderColor = 'rgba(22, 163, 74, 0.8)';
      } else {
        // Yellow for available but not eligible
        backgroundColor = 'rgba(251, 191, 36, 0.6)';
        borderColor = 'rgba(217, 119, 6, 0.8)';
      }

      // Create the overlay div
      return (
        <div
          key={area.roomId}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: backgroundColor,
            border: `2px solid ${borderColor}`,
            boxSizing: 'border-box',
            pointerEvents: 'none', // Ensure clicks pass through
            zIndex: 5
          }}
        />
      );
    });
  };

  const handleAreaMouseOver = async (e, info, roomId) => {
    setTooltipInfo(info);
    setShowTooltip(true);
    updateTooltipPosition(e);

    // Only fetch detailed room info if we have a room ID
    if (roomId) {
      await fetchRoomDetails(roomId);
    } else {
      setTooltipRoom(null);
    }
  };

  const handleAreaMouseOut = () => {
    setShowTooltip(false);
    setTooltipRoom(null);
  };

  const handleAreaMouseMove = (e) => {
    updateTooltipPosition(e);
  };

  const updateTooltipPosition = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15
      });
    }
  };

  const handleRoomSelect = async (roomId) => {
    try {
      console.log("Starting room selection for roomId:", roomId);
      console.log("Current userId:", userId);

      // Get the room information
      const room = allRooms.find(r => r.id === roomId);

      // Check eligibility first
      if (room) {
        const eligibilityStatus = getRoomEligibilityStatus(room);

        if (!eligibilityStatus.eligible) {
          // Display appropriate error message based on reason
          if (eligibilityStatus.reason === "class_year") {
            alert(`This room is only available for ${room.class_year === 1 ? 'Freshman' :
                room.class_year === 2 ? 'Sophomore' :
                  room.class_year === 3 ? 'Junior' : 'Senior'} and above.`);
            return;
          } else if (eligibilityStatus.reason === "capacity") {
            alert(`This room is for ${room.capacity} people, but your group size is ${groupSize}.`);
            return;
          } else if (eligibilityStatus.reason === "both") {
            alert(`This room is not eligible for your group. It requires ${room.class_year === 1 ? 'Freshman' :
                room.class_year === 2 ? 'Sophomore' :
                  room.class_year === 3 ? 'Junior' : 'Senior'} or above and a group size of ${room.capacity}.`);
            return;
          }
        }
      }

      // Check if the user already has a room assigned
      const userResponse = await axios.get(`https://backend-housing47.onrender.com//users/get_user/${userId}`);
      const userData = userResponse.data;
      console.log("User data received:", userData);

      if (userData.room_id) {
        console.log("User already has room assigned:", userData.room_id);
        // Confirm with user that they want to change rooms
        if (!window.confirm("You already have a room assigned. Do you want to change your selection?")) {
          console.log("User cancelled room change");
          return;
        }

        // Unselect the current room first
        console.log("Unselecting current room...");
        const unselectResponse = await axios.post("https://backend-housing47.onrender.com/rooms/unselectRoom", {
          room_id: userData.room_id,
          user_id: userId
        });
        console.log("Room unselection response:", unselectResponse.data);
      }

      // Select the new room
      console.log("Selecting new room...");
      const selectResponse = await axios.post("https://backend-housing47.onrender.com/rooms/selectRoom", {
        room_id: roomId,
        user_id: userId
      });
      console.log("Room selection response:", selectResponse.data);

      // Refresh the room data
      console.log("Refreshing room data...");
      const roomsResponse = await axios.get("https://backend-housing47.onrender.com/rooms");
      const roomsData = roomsResponse.data;
      console.log("Room data received:", roomsData.length, "rooms");

      const dormRooms = roomsData.filter(room => room.building_id === "HARWOOD");
      console.log("Filtered room data for current dorm:", dormRooms.length, "rooms");

      setAllRooms(dormRooms);

      // Show success message
      alert("Room selected successfully!");

    } catch (error) {
      console.error("Error selecting room:", error);

      // Enhanced error reporting
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response from server:", error.response.data);
        console.error("Error status:", error.response.status);
        alert(`Failed to select room: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server");
        alert("Failed to select room: No response from server. Check if the server is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error during request setup:", error.message);
        alert(`Failed to select room: ${error.message}`);
      }
    }
  };

  const handleBackToMap = () => {
    navigate("/map");
  };

  const resetFilters = () => {
    setFilterCapacity("");
    setFilterClassYear("");
    setFilterAvailability("available");
    setFilterAC("");
    setFilterEligibility("all");
  };

  // Get unique values for filters
  const getUniqueValues = (field) => {
    if (!allRooms || allRooms.length === 0) return [];
    const uniqueValues = [...new Set(allRooms.map(room => room[field]))];
    return uniqueValues.sort((a, b) => a - b); // Sort numerically
  };

  const uniqueCapacities = getUniqueValues("capacity");
  const uniqueClassYears = getUniqueValues("class_year");

  // Get eligibility reason text
  const getEligibilityReasonText = (eligibilityStatus, room) => {
    if (eligibilityStatus.reason === "class_year") {
      return `Requires ${room.class_year === 1 ? 'Freshman' :
          room.class_year === 2 ? 'Sophomore' :
            room.class_year === 3 ? 'Junior' : 'Senior'} or above`;
    } else if (eligibilityStatus.reason === "capacity") {
      return `For ${room.capacity} people (your group: ${groupSize})`;
    } else if (eligibilityStatus.reason === "both") {
      return `Requires ${room.class_year === 1 ? 'Freshman' :
          room.class_year === 2 ? 'Sophomore' :
            room.class_year === 3 ? 'Junior' : 'Senior'} or above and ${room.capacity} people`;
    }
    return "";
  };

  // Get total counts for different room categories
  const countEligibleRooms = () => {
    if (allRooms.length === 0) return { eligible: 0, ineligible: 0, taken: 0 };

    const eligible = allRooms.filter(room => isRoomEligible(room)).length;
    const ineligible = allRooms.filter(room => !room.is_taken && !isRoomEligible(room)).length;
    const taken = allRooms.filter(room => room.is_taken).length;

    return { eligible, ineligible, taken };
  };

  const roomCounts = countEligibleRooms();

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>Housing47</span>
        </div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate("/dashboard")} style={styles.navLink}>Home</button>
          <button onClick={() => navigate("/map")} style={styles.navLink}>Browse Housing</button>
          <button onClick={() => navigate("/users")} style={styles.navLink}>Find Roommates</button>
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              navigate("/");
            }}
            style={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        {/* Left Side Filters */}
        <div style={styles.leftSidebar}>
          <div style={styles.sidebarHeader}>
            <button
              onClick={handleBackToMap}
              style={styles.backButton}
            >
              ← Back to Map
            </button>
            <h1 style={styles.dormTitle}>{dormId.replace(/-/g, " ").toUpperCase()}</h1>
            <p style={styles.dormSubtitle}>Interactive Floor Plan</p>
          </div>

          <div style={styles.filterSection}>
            <h2 style={styles.filterTitle}>Filter Rooms</h2>

            {/* User info and eligibility explanation */}
            <div style={styles.userInfoPanel}>
              <div style={styles.eligibilityNote}>
                <p>Eligible rooms must match your group size and be available for your class year or lower.</p>
              </div>
            </div>

            {/* Room Counts */}
            <div style={styles.roomCountsContainer}>
              <div style={styles.roomCountItem}>
                <div style={styles.eligibleIndicator}></div>
                <span>{roomCounts.eligible} eligible</span>
              </div>
              <div style={styles.roomCountItem}>
                <div style={styles.ineligibleIndicator}></div>
                <span>{roomCounts.ineligible} ineligible</span>
              </div>
              <div style={styles.roomCountItem}>
                <div style={styles.takenIndicator}></div>
                <span>{roomCounts.taken} taken</span>
              </div>
            </div>

            {/* Filter by Eligibility */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Room Eligibility</label>
              <select
                style={styles.filterSelect}
                value={filterEligibility}
                onChange={(e) => setFilterEligibility(e.target.value)}
              >
                <option value="all">All Rooms</option>
                <option value="eligible">Eligible Rooms Only</option>
                <option value="ineligible">Ineligible Rooms Only</option>
              </select>
            </div>

            {/* Filter by Availability */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Availability</label>
              <select
                style={styles.filterSelect}
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
              >
                <option value="all">All Rooms</option>
                <option value="available">Available Only</option>
                <option value="taken">Taken Only</option>
              </select>
            </div>

            {/* Filter by AC */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Air Conditioning</label>
              <select
                style={styles.filterSelect}
                value={filterAC}
                onChange={(e) => setFilterAC(e.target.value)}
              >
                <option value="">All Rooms</option>
                <option value="yes">With AC Only</option>
                <option value="no">Without AC</option>
              </select>
            </div>

            {/* Filter by Capacity */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Room Capacity</label>
              <select
                style={styles.filterSelect}
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
              >
                <option value="">All Capacities</option>
                {uniqueCapacities.map(capacity => (
                  <option key={capacity} value={capacity}>
                    {capacity} {capacity === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Class Year */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Class Year Eligibility</label>
              <select
                style={styles.filterSelect}
                value={filterClassYear}
                onChange={(e) => setFilterClassYear(e.target.value)}
              >
                <option value="">All Class Years</option>
                {uniqueClassYears.map(year => (
                  <option key={year} value={year}>
                    {year === 1 ? 'Freshman' :
                      year === 2 ? 'Sophomore' :
                        year === 3 ? 'Junior' : 'Senior'}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterInfo}>
              <p>Your group size: <strong>{groupSize}</strong></p>
              <p>Your class year: <strong>
                {userClassYear === 1 ? 'Freshman' :
                  userClassYear === 2 ? 'Sophomore' :
                    userClassYear === 3 ? 'Junior' :
                      userClassYear === 4 ? 'Senior' : 'Unknown'}
              </strong></p>
            </div>

            <button style={styles.resetButton} onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          {/* Filtered Room List */}
          <div style={styles.roomListSection}>
            <h2 style={styles.roomListTitle}>
              Available Rooms {filteredRooms.length > 0 ? `(${filteredRooms.length})` : ''}
            </h2>

            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p>Loading rooms...</p>
              </div>
            ) : error ? (
              <div style={styles.errorContainer}>
                <p>{error}</p>
              </div>
            ) : filteredRooms.length > 0 ? (
              <div style={styles.roomListWrapper}>
                <div style={styles.roomList}>
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      style={{
                        ...styles.roomListItem,
                        ...(room.is_taken ? styles.roomTaken : {})
                      }}
                      onClick={() => !room.is_taken && handleRoomSelect(room.id)}
                    >
                      <div style={styles.roomNumber}>Room {room.room_number}</div>
                      <div style={styles.roomDetails}>
                        <span>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                        <span> • </span>
                        <span>{
                          room.class_year === 1 ? 'Freshman' :
                            room.class_year === 2 ? 'Sophomore' :
                              room.class_year === 3 ? 'Junior' : 'Senior'}
                        </span>
                        {room.has_ac && <span> • <span style={styles.acBadge}>AC</span></span>}
                      </div>
                      <div style={styles.roomStatus}>
                        {room.is_taken ? (
                          <span style={styles.takenBadge}>Taken</span>
                        ) : (
                          <span style={styles.availableBadge}>Available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={styles.noRoomsText}>No rooms match your filters.</p>
            )}
          </div>
        </div>

        {/* Right Side Image */}
        <div style={styles.rightContent}>
          {image ? (
            <div style={styles.imageContainer}>
              <img
                ref={imageRef}
                src={image}
                alt={`${dormId} layout`}
                useMap={`#${dormId}-map`}
                style={styles.mapImage}
              />

              {/* Room Overlays - Highlight taken rooms in green, available in red */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 5
              }}>
                {renderRoomOverlays()}
              </div>

              {/* Enhanced Tooltip */}
              {showTooltip && (
                <div style={{
                  ...styles.tooltip,
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                }}>
                  {tooltipLoading ? (
                    <div style={styles.tooltipLoading}>Loading...</div>
                  ) : tooltipRoom ? (
                    <div style={styles.tooltipDetailed}>
                      <div style={styles.tooltipTitle}>Room {tooltipRoom.room_number}</div>
                      <div style={styles.tooltipDetails}>
                        <p>Capacity: {tooltipRoom.capacity} {tooltipRoom.capacity === 1 ? 'person' : 'people'}</p>
                        <p>Status: {
                          tooltipRoom.is_taken ?
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Taken</span> :
                            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Available</span>
                        }</p>
                        <p>Class Year: {
                          tooltipRoom.class_year === 1 ? 'Freshman' :
                            tooltipRoom.class_year === 2 ? 'Sophomore' :
                              tooltipRoom.class_year === 3 ? 'Junior' : 'Senior'
                        }</p>
                        {tooltipRoom.time_taken && (
                          <p>Previously taken: {formatTimestamp(tooltipRoom.time_taken)}</p>)}
                        {tooltipRoom.dimensions && <p>Size: {tooltipRoom.dimensions}</p>}
                        {tooltipRoom.has_ac && <p>Air Conditioning: Yes</p>}
                        {tooltipRoom.dimensions && <p>Size: {tooltipRoom.dimensions}</p>}
                        {tooltipRoom.features && tooltipRoom.features.length > 0 && (
                          <p>Features: {tooltipRoom.features.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>{tooltipInfo}</div>
                  )}
                </div>
              )}

              {/* Image Map */}
              <map name={`${dormId}-map`}>
                {mapData.map((area, index) => {
                  // Find the actual room data for this map area
                  const roomInfo = allRooms.find(r => r.room_number === area.roomId);
                  const displayInfo = roomInfo ?
                    `Room ${roomInfo.room_number} - ${roomInfo.capacity} person${roomInfo.capacity !== 1 ? 's' : ''} - ${roomInfo.is_taken ? 'Taken' : 'Available'}${roomInfo.has_ac ? ' - Has AC' : ''}` :
                    area.info;

                  return (
                    <area
                      key={index}
                      shape="rect"
                      coords={area.coords}
                      alt={`Room ${area.roomId}`}
                      onClick={() => roomInfo && !roomInfo.is_taken && handleRoomSelect(roomInfo.id)}
                      onMouseOver={(e) => handleAreaMouseOver(e, displayInfo, roomInfo?.id)}
                      onMouseOut={handleAreaMouseOut}
                      onMouseMove={handleAreaMouseMove}
                      style={{ cursor: roomInfo && !roomInfo.is_taken ? "pointer" : "default" }}
                    />
                  );
                })}
              </map>
            </div>
          ) : (
            <div style={styles.noImageContainer}>
              <p style={styles.noImageText}>No layout image found for this dorm.</p>
            </div>
          )}
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
    zIndex: 10,
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
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 137px)', // Header and footer height
    overflow: 'hidden',
  },
  leftSidebar: {
    width: '350px',
    backgroundColor: 'white',
    borderRight: '1px solid #E5E7EB',
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sidebarHeader: {
    marginBottom: '1rem',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    color: '#4F46E5',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
    marginBottom: '1rem',
  },
  dormTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: '0',
    marginBottom: '0.25rem',
  },
  dormSubtitle: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: '0',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.5rem',
  },
  filterTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 0.5rem 0',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  filterLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#4B5563',
  },
  filterSelect: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #D1D5DB',
    fontSize: '0.875rem',
    color: '#1F2937',
    backgroundColor: 'white',
  },
  filterInfo: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#EEF2FF',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#4338CA',
  },
  resetButton: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  automaticFilterButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  roomListSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  roomListTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 1rem 0',
  },
  roomListWrapper: {
    width: '100%',
    marginBottom: '1rem',
  },
  roomList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    maxHeight: '300px', // Set a fixed height for the container
    borderRadius: '0.5rem',
    padding: '0.5rem',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#F9FAFB',
  },
  roomListItem: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.1s',
  },
  roomTaken: {
    backgroundColor: '#F3F4F6',
    cursor: 'default',
    opacity: 0.8,
  },
  roomNumber: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: '0.875rem',
  },
  roomDetails: {
    color: '#6B7280',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  },
  acBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    fontSize: '0.625rem',
    fontWeight: '500',
  },
  roomStatus: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  availableBadge: {
    backgroundColor: '#D1FAE5', // Light green for available
    color: '#047857', // Dark green
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
  },
  takenBadge: {
    backgroundColor: '#FEE2E2', // Light red for taken
    color: '#B91C1C', // Dark red
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
  },
  noRoomsText: {
    color: '#6B7280',
    fontSize: '0.875rem',
    fontStyle: 'italic',
  },
  rightContent: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: '1rem',
    overflow: 'auto',
  },
  imageContainer: {
    position: 'relative',
    maxHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', // Make sure overlays don't get clipped
  },
  mapImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    zIndex: 100,
    pointerEvents: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: '300px',
  },
  tooltipLoading: {
    padding: '0.25rem 0',
    fontSize: '0.75rem',
  },
  tooltipDetailed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  tooltipTitle: {
    fontWeight: '700',
    fontSize: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '0.25rem',
  },
  tooltipDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.75rem',
  },
  noImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  noImageText: {
    color: '#6B7280',
    fontSize: '1.125rem',
  },
  footer: {
    borderTop: '1px solid #E5E7EB',
    padding: '1rem',
    textAlign: 'center',
    color: '#6B7280',
    backgroundColor: 'white',
    fontSize: '0.875rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
    color: '#6B7280',
  },
  loadingSpinner: {
    width: '2rem',
    height: '2rem',
    border: '3px solid #E5E7EB',
    borderTopColor: '#4F46E5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '0.5rem',
  },
  errorContainer: {
    padding: '1rem',
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  },
};

export default DormDetail;