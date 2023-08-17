import React from "react";
import Header from "../components/Header";
import "../styles/pages/Login.css";


// This is a page to temporarily display to the user to let them know they are logged out and to come back soon
const Logout = () => {
  return (
    <div>
     {/* Display the header with a subtitle indicating the user is logged out */}
      <Header subtitle="Logged out!" page="logout" />
      {/* Logout content */}
      <div className="logout gradient-background">
        <h2 id="logout-comeback">Come back soon...</h2>
        <img id="logout-photo" src={`${process.env.PUBLIC_URL}/images/cocktailIcon.png`}></img>
        <h2 id="logout-cheers">Cheers!!!</h2>
      </div>
    </div>
  );
};

export default Logout;
