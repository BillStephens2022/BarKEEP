import React from "react";
import "../styles/components/Header.css";

const Header = ({ subtitle }) => {
  return (
    <div className="header">
      <h1 className="header-title">BarKEEP</h1>
      <h2 className="header-subtitle">{subtitle}</h2>
    </div>
  );
};

export default Header;
