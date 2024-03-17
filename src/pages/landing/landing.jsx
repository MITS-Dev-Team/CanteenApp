import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";
import landinglogo from "./landing-logo.png";

function Landing() {
  return (
    <div className="landing-container">
      <img src={landinglogo} alt="Logo" className="logo" />
      <div className="button-container">
        <Link to="/login" className="button">
          Login
        </Link>
        <Link to="/signup" className="button">
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Landing;
