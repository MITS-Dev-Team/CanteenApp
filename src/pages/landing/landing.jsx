import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";
import landinglogo from "./landing-logo.png";
import { FaGoogle } from "react-icons/fa";

function Landing() {
  return (
    <div className="landing-container">
      <img src={landinglogo} alt="Logo" className="logo" />
      <div className="button flex bg-[#FAB317] gap-4">
        <FaGoogle size={30} color="white" className=""/>
        <Link to="/login" className=" font-extrabold font-4xl">
          Login With Google
        </Link>

      </div>
    </div>
  );
}

export default Landing;
