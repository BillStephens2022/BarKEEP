import React from "react";
import { LiaGlassCheersSolid } from "react-icons/lia";
import Header from "../components/Header";
import CocktailCard from "../components/CocktailCard";
import PostPhoto from "../components/PostPhoto";
import { cocktailData } from "../data/cocktaildata";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";
import "../styles/pages/About.css";

// About Page
const About = () => {

  // Select a random cocktail recipe to render as an example in the CocktailCard component of this page.
  const { cocktails } = cocktailData.data;
  const randomCocktailIndex = Math.floor(Math.random() * cocktails.length);
  const randomCocktail = cocktails[randomCocktailIndex];

  return (
    <div className="about">
      {/* Render the page header */}
      <Header subtitle="About" page="about" />
      <div className="about-main">
        <div className="about-video">
          {/* Render the background video */}
          <video
            className="about-video-content"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
          >
            <source
              src={`${process.env.PUBLIC_URL}/images/cocktail.mp4`}
              type="video/mp4"
            />
            <source
              src={`${process.env.PUBLIC_URL}/images/cocktail.webm`}
              type="video/webm"
            />
            Your browser is not supported!
          </video>
        </div>
        <div className="about-summary-container">
          {/* A brief summary of the app's purpose */}
          <p className="about-summary-p">
            Welcome to <span id="about-span-barkeep-1">Bar</span>
            <span id="about-span-barkeep-2">KEEP</span>, the destination for
            cocktail enthusiasts!
          </p>
          <p className="about-summary-p">
            Whether you're a professional bartender, a home mixologist, or
            simply someone who appreciates a well crafted cocktail,{" "}
            <span id="about-span-barkeep-3">BarKEEP</span> is for you!
          </p>
          <p className="about-summary-p">
            Cheers!
            <i id="about-cheers-icon">
              <LiaGlassCheersSolid />
            </i>
          </p>
        </div>
        {/* Display app features */}
        <h2 className="about-h2">Features</h2>
        <div className="about-features-container">
        {/* Display features based on user authentication - if user is not logged in they will see a box 
        about signing up/logging in and logging in as a guest */}
          {!Auth.loggedIn() ? (
            // Features for non-logged-in users
            <div className="about-features-card">
            {/* Provide option to log in or sign up */}
              <p className="about-features-text">
                <Link to="/login">Login</Link> as a{" "}
                <span id="about-guest">guest</span> if you'd like to test drive
                the app before registering.
              </p>
              <p className="about-features-text">-- OR --</p>
              <p className="about-features-text">
                <Link to="/login">Sign up</Link> to add your own creations, save your favorite recipes, post
                your favorite photos & recipes with the fellow enthusiasts.
              </p>
              {/* Provide a button to get started */}
              <Link className="btn btn-get-started" to="/login">
                Get Started
              </Link>
            </div>
          ) : null}
          {/* Feature: Discover cocktail recipes */}
          <div className="about-features-card" id="about-features-card-recipe">
            {/* Explain the feature of discovering cocktail recipes */}
            <p className="about-features-text">
              Discover an extensive collection of{" "}
              <span id="about-span-cocktail-recipes">cocktail recipes</span>{" "}
              from classic to contemporary. Save your favorite recipes to your profile for easy access. 
              In the example below, click "See
              Recipe".
              {/* Render a random cocktail recipe example */}
              <div className="about-cocktail-recipe">
                <CocktailCard
                  cocktails={[randomCocktail]}
                  page="about"
                  customClass="about-cocktail-card"
                  cocktailAdded={{}}
                />
              </div>
            </p>
          </div>
          {/* Feature: Post cocktail photos */}
          <div className="about-features-card">
            {/* Explain the feature of posting cocktail photos */}
            <p className="about-features-text">
              <span id="about-span-post">Post</span> your favorite cocktail pics
              and share your own unique creations with the community.
              {/* Render an example of a posted cocktail photo */}
              <div className="about-sample-post">
                <PostPhoto
                  imageUrl={process.env.PUBLIC_URL + "images/samplePost.png"}
                  page="about"
                  />
                
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
