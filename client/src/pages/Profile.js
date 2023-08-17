import React, { useState } from "react";

import Header from "../components/Header";
import MyPosts from "../components/MyPosts";
import MyFavorites from "../components/MyFavorites";
import "../styles/pages/Profile.css";

const Profile = () => {
  // State to manage the view - "myFavorites" or "myPosts"
  const [view, setView] = useState("myFavorites");

  return (
    <div className="profile">
      {/* Display the header with "Profile" title */}
      <Header page="profile" subtitle="Profile" />
      {/* Buttons to switch between "Favorite Recipes" and "My Posts" views */}
      <div className="profile-button-div">
        <h3>View:</h3>
        {/* Button to view favorite recipes */}
        <button
          className={`btn btn-view btn-my-favorites ${
            view === "myFavorites" ? "active" : ""
          }`}
          onClick={() => setView("myFavorites")}
        >
          Favorite Recipes
        </button>
        {/* Button to view user's posts */}
        <button
          className={`btn btn-view btn-my-posts ${
            view === "myPosts" ? "active" : ""
          }`}
          onClick={() => setView("myPosts")}
        >
          My Posts
        </button>
      </div>
      {/* Conditional rendering based on the selected view */}
      {view === "myPosts" ? <MyPosts /> : <MyFavorites />}
    </div>
  );
};

export default Profile;
