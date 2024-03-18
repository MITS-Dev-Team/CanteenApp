import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";
import landinglogo from "./landing-logo.png";
import { FaGoogle } from "react-icons/fa";
import supabase from "../../supabase";
import { useState, useEffect } from "react";

function Landing() {
  const [user, setUser] = useState(null);
  async function userStatus() {
    const user = await supabase.auth.getUser();
    setUser(user.data.user); // Set the user state to user.data.user
  }
  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  useEffect(() => {
    userStatus();
    window.addEventListener("hashchange", function () {
      userStatus();
    });
  }, []);

  if (user) {
    return (
      <div className="landing-container">
        <span>Hello {user.email}</span>
        <div className="button flex bg-[#FAB317] poppins-regular gap-4">
          <FaGoogle size={30} color="white" className="" />
          <Link onClick={signOut} className="font-extrabold font-4xl">
            LogOut
          </Link>
        </div>
      </div>
    );
  } else
    return (
      <div className="landing-container">
        <img src={landinglogo} alt="Logo" className="logo" />
        <div className="button flex bg-[#FAB317] poppins-regular gap-4">
          <FaGoogle size={30} color="white" className="" />
          <Link onClick={signIn} className=" font-extrabold font-4xl">
            Login With Google
          </Link>
        </div>
      </div>
    );
}

export default Landing;
