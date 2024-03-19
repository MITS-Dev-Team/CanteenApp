import React from "react";
import "./landing.css";
import landinglogo from "./landing-logo.png";
import { FaGoogle } from "react-icons/fa";
import supabase from "../../supabase";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

function Landing() {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch(); // dispatch is used to dispatch an action to the redux store
  async function userStatus() {
    const user = await supabase.auth.getUser();
    // setUser(user.data.user); // Set the user state to user.data.user
    dispatch({ type: "SET_USER", payload: user.data.user });
  }
  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
    dispatch({ type: "SET_USER", payload: null });
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
        <div
          onClick={signOut}
          className="button flex bg-[#FAB317] poppins-regular gap-4"
        >
          <FaGoogle size={30} color="white" className="" />
          <span className="font-extrabold font-4xl">LogOut</span>
        </div>
      </div>
    );
  } else
    return (
      <div className="landing-container">
        <img src={landinglogo} alt="Logo" className="logo" />
        <div
          onClick={signIn}
          className="button flex bg-[#FAB317] poppins-regular gap-4"
        >
          <FaGoogle size={30} color="white" />

          <span className=" font-extrabold font-4xl">Login With Google</span>
        </div>
      </div>
    );
}

export default Landing;
