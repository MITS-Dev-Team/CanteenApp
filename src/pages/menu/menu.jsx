import React from "react";
import supabase from "../../supabase";

function Menu() {
  async function signOut() {
    await supabase.auth.signOut();
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
