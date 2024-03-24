import React from "react";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../../supabase";

function Menu() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(user);
  async function signOut() {
    await supabase.auth.signOut();
    dispatch({ type: "SET_USER", payload: null });
  }

  return (
    <div>
      <button className="button" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Menu;
