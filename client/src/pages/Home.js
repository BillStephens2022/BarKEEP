import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";
import { drinkingQuotes } from "../data/cocktaildata";
import "../styles/pages/Home.css";

const Home = () => {
  const [randomQuote, setRandomQuote] = useState(null);

  // Function to retrieve and set a random quote from the provided data
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * drinkingQuotes.length);
    setRandomQuote(drinkingQuotes[randomIndex]);
  };
  // Call getRandomQuote when the component mounts
  useEffect(() => {
    getRandomQuote(); 
  }, []); // Empty dependency array means this effect runs once after mounting
  
  // Function to generate a random value within a given range
  const generateRandomValue = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // Get the user's profile information if logged in
  const userProfile = Auth.loggedIn() ? Auth.getProfile() : null;
  // Extract the username from the profile if it exists
  const username = userProfile?.data.username;

  return (
    <div className="main">
      <div className="home-headings">
        {/* App title and subtitle */}
        <h1 className="home-title">
          <span className="slide-in-left">Bar</span>
          <span className="slide-in-right">KEEP</span>
        </h1>
        <h2 className="home-subtitle">For Cocktail Enthusiasts</h2>
        {/* Render welcome message with username if user is logged in, 
        or "Get Started" button if user not logged in yet*/}
        {Auth.loggedIn() ? (
          <p className="welcome-message">
            Welcome, <span className="welcome-username">{username}</span>
            <span></span>!
          </p>
        ) : (
          <Link className="btn btn-get-started" to="/login">
            Get Started
          </Link>
        )}
        {/* Display an image with cocktails */}
        <div className="home_photo">
          <img
            className="home_photo_image"
            src="https://www.tastingtable.com/img/gallery/11-cocktails-to-try-if-you-like-drinking-gin/intro-1659025591.webp"
            alt="Cocktail"
          ></img>
        </div>
        {/* Display a humorous random drinking quote */}
        {randomQuote && (
          <div id="home-quote-div">
            <h3 id="home-quote-h3">Random Quote:</h3>
            <p id="home-random-quote">
              "{randomQuote.quote}" - {randomQuote.author}
            </p>
          </div>
        )}
      </div>
      {/* Render animated bubbles */}
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
