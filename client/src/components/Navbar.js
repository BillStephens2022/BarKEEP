import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track whether Navbar is expanded or not
  const [activeNavItem, setActiveNavItem] = useState(""); // State to track active Nav item for styling

  // To toggle between expanded/collapsed state
  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  // Update the active navigation item when clicked
  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
    setIsExpanded(false);
  };
  
  // render the NavBar component
  return (
    <div className={`navigation ${isExpanded ? "expanded" : ""}`}>
      {/* Sidebar */}
      

      {/* Hamburger Menu */}
      <div className={`hamburger-menu ${isExpanded ? "expanded" : ""}`}>
        <button
          className={`menu-toggle ${isExpanded ? "expanded" : ""}`}
          onClick={toggleMenu}
        >
          <span className={`hamburger ${isExpanded ? "expanded" : ""}`}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </span>
        </button>
        <ul className={`navigation_list ${isExpanded ? "expanded" : ""}`}>
          {/* Home */}
          <li
            className={`navigation_item ${
              activeNavItem === "home" ? "navigation_item--active" : ""
            }`}
            onClick={() => handleNavItemClick("home")}
          >
            <Link to="/" className="navigation_link">
              Home
            </Link>
          </li>
          {/* About */}
          <li
            className={`navigation_item ${
              activeNavItem === "about" ? "navigation_item--active" : ""
            }`}
            onClick={() => handleNavItemClick("about")}
          >
            <Link to="/about" className="navigation_link">
              About
            </Link>
          </li>
          {/* Conditional rendering based on user authentication */}
          {Auth.loggedIn() ? (
             // If user is logged in
            <>
            {/* Profile */}
            <li
                className={`navigation_item ${
                  activeNavItem === "profile" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("profile")}
              >
                <Link to="/profile" className="navigation_link">
                  Profile
                </Link>
              </li>
              {/* Community Posts */}
              <li
                className={`navigation_item ${
                  activeNavItem === "community" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("community")}
              >
                <Link to="/community" className="navigation_link">
                  Community Posts
                </Link>
              </li>
              {/* Search */}
              <li
                className={`navigation_item ${
                  activeNavItem === "search" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("search")}
              >
                <Link to="/searchCocktails" className="navigation_link">
                  Search
                </Link>
              </li>
              {/* Gallery */}
              <li
                className={`navigation_item ${
                  activeNavItem === "gallery" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("gallery")}
              >
                <Link to="/gallery" className="navigation_link">
                  Gallery
                </Link>
              </li>
              {/* Log Out */}
              <li className="navigation_item">
                <Link
                  to="/logout"
                  className="navigation_link"
                  onClick={() => {
                    handleNavItemClick("");
                    Auth.logout();
                  }}
                >
                  Log Out
                </Link>
              </li>
            </>
          ) : (
            // If user is not logged in, render Login page
            <li
              className={`navigation_item ${
                activeNavItem === "login" ? "navigation_item--active" : ""
              }`}
            >
              <Link
                to="/login"
                className="navigation_link"
                onClick={() => handleNavItemClick("login")}
              >
                Log In / Register
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
