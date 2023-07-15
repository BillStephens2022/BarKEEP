import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";
import "../styles/Navbar.css"

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

  return (
    <div className={`navigation ${isExpanded ? "expanded" : ""}`}>
      {/* Sidebar */}
      <nav className="sidebar">
        <ul className="navigation_list">
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
          {Auth.loggedIn() ? (
            <>
              <li
                className={`navigation_item ${
                  activeNavItem === "feed" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("feed")}
              >
                <Link to="/feed" className="navigation_link">
                  Feed
                </Link>
              </li>
              <li
                className={`navigation_item ${
                  activeNavItem === "favorites" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("favorites")}
              >
                <Link to="/favorites" className="navigation_link">
                  Favorites
                </Link>
              </li>
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
            <li className="navigation_item">
              <Link to="/login" className="navigation_link">
                Log In / Register
              </Link>
            </li>
          )}
        </ul>
      </nav>

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
          {Auth.loggedIn() ? (
            <>
              <li
                className={`navigation_item ${
                  activeNavItem === "feed" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("feed")}
              >
                <Link to="/feed" className="navigation_link">
                  Feed
                </Link>
              </li>
              <li
                className={`navigation_item ${
                  activeNavItem === "favorites" ? "navigation_item--active" : ""
                }`}
                onClick={() => handleNavItemClick("favorites")}
              >
                <Link to="/favorites" className="navigation_link">
                  Favorites
                </Link>
              </li>
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
            <li className={`navigation_item ${
                  activeNavItem === "login" ? "navigation_item--active" : ""
                }`}>
              <Link to="/login" className="navigation_link" onClick={() => handleNavItemClick("login")}>
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
