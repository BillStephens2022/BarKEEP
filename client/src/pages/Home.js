import React from "react";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";
import "../styles/Home.css";

const Home = () => {
  const generateRandomValue = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // Get the user's profile information
  const userProfile = Auth.loggedIn() ? Auth.getProfile() : null;
  // Extract the username from the profile if it exists
  const username = userProfile?.data.username;


  return (
    <div className="main">
      <div className="home-headings">
        <h1 className="home-title"><span className="slide-in-left">Bar</span><span className="slide-in-right">KEEP</span></h1>
        <h2 className="home-subtitle">For Cocktail Enthusiasts</h2>
        {Auth.loggedIn() ? (
          <p className="welcome-message">Welcome, <span className="welcome-username">{username}</span><span></span>!</p>
        ) : (
          <Link className="btn btn-get-started" to="/login">
            Get Started
          </Link>
        )}
        <div className="home_photo">
          <img
            className="home_photo_image"
            src="https://www.tastingtable.com/img/gallery/11-cocktails-to-try-if-you-like-drinking-gin/intro-1659025591.webp"
            alt="Cocktail"
          ></img>
        </div>
      </div>

      <div className="bubbles-container">
        {Array.from({ length: 250 }, (_, index) => {
          const randomX = generateRandomValue(0, 1);
          const randomSize = generateRandomValue(5, 20);

          return (
            <div
              key={index}
              className="bubble"
              style={{
                animationDelay: `${(20 - index) * 0.5}s`,
                "--randomX": randomX,
                "--randomSize": `${randomSize}px`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
