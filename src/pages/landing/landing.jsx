import React from "react";
import "./landing.css";
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
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
    if (error) alert(error.message);
  }

  useEffect(() => {
    userStatus();
    window.addEventListener("hashchange", function () {
      userStatus();
    });
  }, []);

  const [loading, setLoading] = useState(false);
  console.log(loading);

  return (
    <div className="landing-container">
      <span
        style={{ fontSize: "50px", color: "#ffff" }}
        className="grifter-regular"
      >
        CANTEEN HUB
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
