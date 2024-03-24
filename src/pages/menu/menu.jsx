import React from "react";
import supabase from "../../supabase";
import { CiSearch } from "react-icons/ci";
import "./menu.css";
const ProfilePhoto = () => {
  return (
    <>
      <img
        src="https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Athul Prakash"
        alt="profile"
        className="profile-pic"
      />
    </>
  );
};

const SearchDish = () => {
  return (
    <div className="input-icon">
      <input
        type="text"
        placeholder="Search for Dishes"
        className="search-dish productsans-regular"
      />
      <CiSearch className="search-icon" color="white" size={30} />
    </div>
  );
};

function Menu() {
  return (
    <div className="menu-screen">
      <ProfilePhoto />
      <div className="menu-screen-title">
        <span style={{ color: "#ffff" }} className="grifter-regular">
          CANTEEN HUB
        </span>
        <br />
        <span
          style={{ color: "#AEADAD", fontWeight: 100 }}
          className="poppins-regular"
        >
          Dining Redefined
        </span>
      </div>
      <SearchDish />
    </div>
  );
}

export default Menu;
