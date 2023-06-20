import React from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";

const Navbar = () => {
  return (
    <div className="navigation">
      <ul className="navigation_list">
        <li className="navigation_item">
          <Link to="/" className="navigation_link">
            Home
          </Link>
        </li>
        <li className="navigation_item">
          <Link to="/randomCocktail" className="navigation_link">
            Random Cocktail
          </Link>
        </li>
        {Auth.loggedIn() ? (
          <>
            <li className="navigation_item">
              <Link to="/cocktails" className="navigation_link">
                My Cocktails
              </Link>
            </li>
            <li className="navigation_item">
              <Link to="/searchCocktails" className="navigation_link">
                Search API for new Cocktail recipes
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
