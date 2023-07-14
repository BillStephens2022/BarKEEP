import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";

const Navbar = () => {
  // state to track active Nav item for styling
  const [activeNavItem, setActiveNavItem] = useState("");

  // Update the active navigation item when clicked
  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
  };

  return (
    <div className="navigation">
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
                onClick={Auth.logout}
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
    </div>
  );
};

export default Navbar;
