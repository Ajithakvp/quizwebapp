import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaQuestionCircle,
  FaTachometerAlt
} from "react-icons/fa";
import "../styles/admin.css";

function AdminLayout({ children }) {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* ===========================
     Protect Route (Admin Only)
  ============================ */
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  /* ===========================
     Logout Function
  ============================ */
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-container">

      {/* ===== Sidebar ===== */}
      <div className="sidebar">

        <div className="sidebar-logo">
          <img
            src="https://infovenz.com/wp-content/uploads/2020/08/Infovenz-Final-website.png"
            alt="Infovenz Logo"
            className="auth-logo"
          />
        </div>

        <ul className="sidebar-menu">

          <li>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/quiz-management"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaClipboardList />
              <span>Quiz Management</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/question-management"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <FaQuestionCircle />
              <span>Question Management</span>
            </NavLink>
          </li>

        </ul>

      </div>

      {/* ===== Main Area ===== */}
      <div className="main-content">

        {/* ===== Top Navbar ===== */}
        <div className="admin-navbar">
          <h4>Welcome, {user?.name || "Admin"}</h4>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* ===== Page Content ===== */}
        <div className="dashboard-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default AdminLayout;
