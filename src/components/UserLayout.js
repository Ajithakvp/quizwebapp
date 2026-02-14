import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaList, FaPlay } from "react-icons/fa";
import "../styles/userLayout.css";

function UserLayout({ children }) {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="user-container">

      {/* ===== SIDEBAR ===== */}
      <div className="user-sidebar">

        <div className="sidebar-logo">
          <img
            src="https://infovenz.com/wp-content/uploads/2020/08/Infovenz-Final-website.png"
            alt="Infovenz Logo"
            className="auth-logo"
          />
        </div>

        <ul className="sidebar-menu">

          <NavLink
            to="/user-dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaUser /> Profile
          </NavLink>

          <NavLink
            to="/quiz-list"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaList /> Quiz Listing
          </NavLink>

          <NavLink
            to="/quiz-attempt"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaPlay /> Attempt Quiz
          </NavLink>

        </ul>

      </div>

      {/* ===== MAIN ===== */}
      <div className="user-main">

        <div className="user-navbar">
          <div className="nav-user">

            👋 Welcome back, {user.name}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="user-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default UserLayout;
