import React from "react";
import "../styles/components/ShimmerLoader.css"; 

const ShimmerLoader = () => {
  return (
    <div className="shimmer-loader gradient-background">
    <h1 className="shimmer-loader-h1">Loading</h1>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
    </div>
  );
};

export default ShimmerLoader;