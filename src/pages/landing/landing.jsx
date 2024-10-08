import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { PiEyeClosedThin, PiEyeThin } from "react-icons/pi";
import { SlLock } from "react-icons/sl";
import supabase from "../../supabase";

import "./landing.css";

const url = new URL(window.origin).href;
console.log(url);
function Landing() {
  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: url },
    });
    if (error) alert(error.message);
  }

  async function signInWithPassword() {
    setLoading(true);

    const { user, session, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error !== null) {
      alert(error);
      setLoading(false);
    }
  }


  const [loading, setLoading] = useState(false);
  const [passwordVisible,setPasswordVisible] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="landing-container">
      <span
        style={{ fontSize: "35px", color: "#ffff", textAlign: "center" }}
        className="grifter-regular"
      >
        MITS Canteen
      </span>
      <span
        style={{
          fontSize: "20px",
          color: "#AEADAD",
          fontWeight: 100,
          textAlign: "center",
        }}
        className="poppins-regular"
      >
        Dining Redefined
      </span>

      {/*<div className="auth-container">
        <label htmlFor="email" className="auth-label productsans-regular">
          Email
        </label>

        <div className="input-container">
          <CiUser className="auth-icon" size={20} />
          <input
            id="email"
            type="email"
            className="auth-input productsans-regular"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label htmlFor="password" className="auth-label productsans-regular">
          Password
        </label>
        <div className="input-container">
          <SlLock className="auth-icon" size={20} />
          {passwordVisible ? (
            <PiEyeThin
              className="auth-icon-eye"
              size={20}
              onClick={() => {
                setPasswordVisible(false);
              }}
            />
          ) : (
            <PiEyeClosedThin
              className="auth-icon-eye"
              size={20}
              onClick={() => {
                setPasswordVisible(true);
              }}
            />
          )}
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            className="auth-input productsans-regular"
            style={{ fontSize: "1em" }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div
          // style={{ marginTop: "25em" }}
          onClick={signInWithPassword}
          className={` button ${
            loading ? "button-focus" : ""
          } poppins-regular gap-4 mt-10 text-center`}
        >
          {loading ? (
            <CircularProgress style={{ color: "#fff" }} size={20} />
          ) : (
            <>
              <span
                className="productsans-regular"
                style={{ fontWeight: "bold" }}
              >
                LOGIN
              </span>
            </>
          )}
        </div>
      </div>*/}

      
      <div
        style={{ marginTop: "3em" }}
        onClick={signIn}
        className={`flex button ${
          loading ? "button-focus" : ""
        } poppins-regular gap-4`}
      >
        {loading ? (
          <CircularProgress style={{ color: "#fff" }} size={18} />
        ) : (
          <>
            <FaGoogle style={{ display: "block" }} size={20} color="#000" />
          </>
        )}
        <span className="font-extrabold font-4xl">Login with Google</span>
      </div>
    </div>
  );
}

export default Landing;
