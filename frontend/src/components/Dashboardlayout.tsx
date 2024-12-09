import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaHome, FaUserMd, FaUserFriends } from "react-icons/fa";
import logo from "../assets/logo.png";
import userIcon from "../assets/white-user-icon-vector-42797441.jpg";
import "./DashboardLayout.css";
import { Local } from "../env/config";
import { GoHome } from "react-icons/go";
import {
  MdOutlineNotificationsActive,
  MdOutlinePersonalInjury,
} from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaStethoscope } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import { MdMarkChatRead } from "react-icons/md";
import { queryClient } from "..";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Effect to check for token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authtoken");
    setToken(storedToken);

    if (!storedToken) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch doctor data using the token
  const fetchDoctorData = async () => {
    const { data } = await axios.get(
      `${Local.BASE_URL}/${Local.DOCTOR_DETAILS}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  // Fetch notification status
  const fetchNotificationStatus = async () => {
    if (!token) return null; // Avoid fetching if token is not present
    const response = await axios.get(
      "http://localhost:5001/users/checknotificationstatus",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  };

  // Query for notification status
  const {
    data: notificationStatus,
    isLoading: statusLoader,
    error: notificationError,
  } = useQuery({
    queryKey: ["notificationStatus"],
    queryFn: fetchNotificationStatus,
    enabled: !!token,
  });
  console.log(notificationStatus);
  // Query for doctor details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctorDetail"],
    queryFn: fetchDoctorData,
    enabled: !!token,
  });

  // Handle loading states and errors
  if (statusLoader || isLoading) {
    return <div>Loading notifications and doctor data...</div>;
  }

  if (isError) {
    return <div>Error loading doctor data</div>;
  }

  if (notificationError) {
    return <div>Error loading notifications</div>;
  }

  // Ensure that data is available before setting localStorage or using it
  if (data) {
    const doctorName = `${data?.doctor?.firstname} ${data?.doctor?.lastname}`;
    const profilePhoto = data?.doctor?.profilephoto || userIcon;
    localStorage.setItem("doctorid", data?.doctor?.id);
    localStorage.setItem("senderdoctorname", doctorName);
  }

  const doctorName = data
    ? `${data?.doctor?.firstname} ${data?.doctor?.lastname}`
    : "";

  const profilePhoto = data?.doctor?.profilephoto || userIcon;

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <nav className="sidebar-nav">
          {data?.doctor?.doctortype === "OD" && (
            <Link to="/app/od" className="nav-link">
              <GoHome /> <span>Dashboard</span>
            </Link>
          )}
          {data?.doctor?.doctortype === "MD" && (
            <Link to="/app/md" className="nav-link">
              <GoHome /> <span>Dashboard</span>
            </Link>
          )}

          <Link to="/app/doctors" className="nav-link">
            <FaStethoscope /> <span>Doctors</span>
          </Link>

          {data?.doctor?.doctortype === "MD" && (
            <Link to="/app/patientreceived" className="nav-link">
              <MdOutlinePersonalInjury /> <span>Patients</span>
            </Link>
          )}
          {data?.doctor?.doctortype === "OD" && (
            <Link to="/app/patients" className="nav-link">
              <MdOutlinePersonalInjury /> <span>Patients</span>
            </Link>
          )}

          {/* Conditional Link based on doctor type */}
          {data?.doctor?.doctortype === "MD" && (
            <Link to="/app/appointmentlist" className="nav-link">
              <FaUserMd />
              <span>Appointments</span>
            </Link>
          )}

          <Link to="/app/staff" className="nav-link">
            <GrGroup /> <span>Staff</span>
          </Link>

          <Link to="/app/chat" className="nav-link">
            <MdMarkChatRead /> <span>Chat</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Fixed Navbar */}
        <div className="navbar">
          <div className="navbar-left">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <h1 className="navbar-title">EYE REFER</h1>
          </div>

          {/* Notification Icon */}
          <div className="flex items-center ml-[800px] relative">
            {statusLoader ? (
              // Loading indicator while the status is being fetched
              <div>Loading notifications...</div>
            ) : (
              <>
                <IoMdNotificationsOutline
                  className="text-4xl cursor-pointer"
                  onClick={async () => {
                    // Perform the API call to mark notifications as seen
                    await axios.put(
                      "http://localhost:5001/users/getallnotification",
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    // Invalidate the notification status query
                    queryClient.invalidateQueries({
                      queryKey: ["notificationStatus"],
                    });

                    // Navigate to the notification page
                    navigate("/app/notification");
                  }}
                />
                {notificationStatus?.unreadCount > 0 && (
                  <div
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    style={{ transform: "translate(50%, -50%)" }}
                  >
                    {notificationStatus.unreadCount}
                  </div>
                )}
              </>
            )}
          </div>

          {/* User Info and Profile Dropdown */}
          <div className="navbar-right">
            <div className="user-info">
              <p className="name">Hi, {doctorName}</p>
              <p className="welcome-text">Welcome Back</p>
            </div>
            <div className="profile-dropdown">
              <img
                src={`${Local.IMAGE_API}/${profilePhoto}`}
                alt="User Profile"
                className="profile-photo"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <ul>
                    <li onClick={() => navigate("/app/profile")}>Profile</li>
                    <li onClick={() => navigate("/app/changepassword")}>
                      Change Password
                    </li>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content can go here */}
        {/* Add your additional components or content here */}
      </div>
    </div>
  );
};

export default DashboardLayout;
