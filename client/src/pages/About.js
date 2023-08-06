import React from "react";
import { LiaGlassCheersSolid } from "react-icons/lia";
import Header from "../components/Header";
import CocktailCard from "../components/CocktailCard";
import cocktailData from "../data/cocktaildata";
import { Link } from "react-router-dom";
import { Auth } from "../utils/auth";
import "../styles/About.css";

const About = () => {
  const { cocktails } = cocktailData.data;
  const randomCocktailIndex = Math.floor(Math.random() * cocktails.length);
  const randomCocktail = cocktails[randomCocktailIndex];

  return (
    <div className="about">
      <Header />
        <div className="about-summary-container">
          <p className="about-summary-p">
            Welcome to <span id="about-span">BarKEEP</span>, the destination for
            cocktail enthusiasts!
          </p>
          <p className="about-summary-p">
            Whether you're a professional bartender, a home mixologist, or
            simply someone who appreciates a well crafted cocktail, BarKEEP is
            for you!
          </p>
          <p className="about-summary-p">
            Cheers!
            <i id="about-cheers-icon">
              <LiaGlassCheersSolid />
            </i>
          </p>
        </div>
        <h2 className="about-h2">Features</h2>
        <ul className="about-list">
          {!Auth.loggedIn() ? (
            <ul>
              <li className="about-list-item">
                Login as a guest if you'd like to test drive the app before
                registering.
              </li>
              <li className="about-list-item">
                Create an account to save your favorite recipes to your profile
                for quick access.
              </li>
              <Link className="btn btn-get-started" to="/login">
                Get Started
              </Link>
            </ul>
          ) : null}
          <li className="about-list-item">
            Connect with fellow enthusiasts, exchange tips & techniques, and
            share your experiences.
          </li>
          <li className="about-list-item">
            Discover an extensive collection of cocktail recipes from classic to
            contemporary. In example below, click "See Recipe".
            <div className="about-cocktail-recipe">
              <CocktailCard cocktails={[randomCocktail]} />
            </div>
          </li>

          <li className="about-list-item">
            Share your favorite cocktail pics and your own unique creations with
            the community.
            <div className="about-sample-post">
              <img
                id="about-sample-post-img"
                src={process.env.PUBLIC_URL + "images/samplePost.png"}
                alt="sample post"
              ></img>
            </div>
          </li>
        </ul>
    </div>
  );
};

export default About;
