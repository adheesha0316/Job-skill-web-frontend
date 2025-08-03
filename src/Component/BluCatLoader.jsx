// src/components/BlueCatLoader.jsx
import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/animations/blueCat.json";

const BlueCatLoader = () => (
  <div style={{ width: 200, margin: "auto" }}>
    <Lottie animationData={animationData} loop autoplay />
  </div>
);

export default BlueCatLoader;
