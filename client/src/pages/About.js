import React from "react";
import { LiaGlassCheersSolid } from "react-icons/lia";
import Header from "../components/Header";
import CocktailCard from "../components/CocktailCard";
import PostPhoto from "../components/PostPhoto";
import { cocktailData } from "../data/cocktaildata";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";
import "../styles/pages/About.css";

const About = () => {
  const { cocktails } = cocktailData.data;
  const randomCocktailIndex = Math.floor(Math.random() * cocktails.length);
  const randomCocktail = cocktails[randomCocktailIndex];

  return (
    <div className="about">
      <Header subtitle={"About"} />
      <div className="about-main">
        <div className="about-video">
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
        <h2 className="about-h2">Features</h2>
        <div className="about-features-container">
          {!Auth.loggedIn() ? (
            <div className="about-features-card">
              <p className="about-features-text">
                <Link to="/login">Login</Link> as a{" "}
                <span id="about-guest">guest</span> if you'd like to test drive
                the app before registering.
              </p>
              <p className="about-features-text">-- OR --</p>
              <p className="about-features-text">
                <Link to="/login">Sign up</Link> to save your favorite recipes
                to your profile for quick access.
              </p>
              <Link className="btn btn-get-started" to="/login">
                Get Started
              </Link>
            </div>
          ) : null}
          <div className="about-features-card" id="about-features-card-recipe">
            <p className="about-features-text">
              Discover an extensive collection of{" "}
              <span id="about-span-cocktail-recipes">cocktail recipes</span>{" "}
              from classic to contemporary. In example below, click "See
              Recipe".
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
          <div className="about-features-card">
            <p className="about-features-text">
              <span id="about-span-post">Post</span> your favorite cocktail pics
              and share your own unique creations with the community.
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
