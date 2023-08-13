import React from "react";
import "../styles/components/ShimmerLoader.css"; 

const ShimmerLoader = () => {
  return (
    <div className="shimmer-loader gradient-background">
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
      <div className="shimmer-line"></div>
    </div>
  );
};

export default ShimmerLoader;