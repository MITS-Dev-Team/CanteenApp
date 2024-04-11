import React from "react";
import "./landing.css";
import { FaGoogle } from "react-icons/fa";
import supabase from "../../supabase";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
const url = new URL(window.origin).href 
console.log(url)
function Landing() {
  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: url }, 
    });
    if (error) alert(error.message);
  }

  const [loading, setLoading] = useState(false);

  return (
    <div className="landing-container">
      <span
        style={{ fontSize: "50px", color: "#ffff" }}
        className="grifter-regular"
      >
        MITS Eatzz
      </span>
      <span
        style={{ fontSize: "30px", color: "#AEADAD", fontWeight: 100 }}
        className="poppins-regular"
      >
        Dining Redefined
      </span>
      <div
        style={{ marginTop: "25em" }}
        onClick={signIn}
        className={`flex button ${
          loading ? "button-focus" : ""
        } poppins-regular gap-4`}
      >
        {loading ? (
          <CircularProgress style={{ color: "#fff" }} size={30} />
        ) : (
          <>
            <FaGoogle style={{ display: "block" }} size={30} color="#000" />
          </>
        )}
        <span className="font-extrabold font-4xl">Login With Google</span>
      </div>
    </div>
  );
}

export default Landing;
