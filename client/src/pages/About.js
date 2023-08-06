import React from 'react';
import '../styles/About.css'; 

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-h1">About BarKEEP</h1>
      <p className="about-summary">Welcome to BarKEEP, your ultimate destination for cocktail enthusiasts!</p>
      <p className="about-summary">Whether you're a professional bartender, a home mixologist, or simply someone who appreciates a finely crafted drink, BarKEEP is here to serve your cocktail cravings.</p>
      <h2 className="about-h2">Features</h2>
      <ul className="about-list">
        <li className="about-list-item">Discover an extensive collection of cocktail recipes from classic to contemporary.</li>
        <li className="about-list-item">Create an account to save your favorite recipes for quick access.</li>
        <li className="about-list-item">Share your own unique cocktail creations with the community.</li>
        <li className="about-list-item">Connect with fellow cocktail enthusiasts, exchange tips, and learn from each other.</li>
      </ul>
      <p>At BarKEEP, we believe that mixing drinks is an art form, and our platform is designed to inspire, educate, and celebrate the cocktail culture.</p>
      <p>Cheers to raising the bar together!</p>
    </div>
  );
}

export default About;