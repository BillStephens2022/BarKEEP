import React, { useState } from "react";

import Header2 from "../components/Header2";
import MyPosts from "../components/MyPosts";
import MyFavorites from "../components/MyFavorites";
import "../styles/pages/Profile.css";

const Profile = () => {
  // State to manage view - see My Posts or My Favorite Recipes
  const [view, setView] = useState("myFavorites");


  return (
    <div className="profile">
      <div className="profile-headings">
        <Header2 page="profile" subtitle="Profile" />
        
       
        <div className="profile-button-div">
          <h3>View:</h3>
          <button className={`btn btn-view btn-my-favorites ${view === "myFavorites" ? "active" : ""}`} onClick={() => setView("myFavorites")}>Favorite Recipes</button>
          <button className={`btn btn-view btn-my-posts ${view === "myPosts" ? "active" : ""}`} onClick={() => setView("myPosts")}>My Posts</button>
        </div>
      </div>
      {view === "myPosts" ? <MyPosts /> : <MyFavorites />}
     
    </div>
  );
};

export default Profile;
