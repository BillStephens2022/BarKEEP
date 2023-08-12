import React from "react";
import Header from "../components/Header";
import Footer from "./Footer";
import "../styles/pages/Login.css";

const Logout = () => {
  return (
    <div>
      <Header subtitle="Logged out!" page="logout" />
      <div className="logout gradient-background">
        <h2 id="logout-comeback">Come back soon...</h2>
        <img id="logout-photo" src={`${process.env.PUBLIC_URL}/images/cocktailIcon.png`}></img>
        <h2 id="logout-cheers">Cheers!!!</h2>
      </div>
    </div>
  );
};

export default Logout;
