import React from "react";
import { IoCartOutline } from "react-icons/io5";
import "./topBar.css";

const userLoggedIn = true; // Change this based on your actual login state
const cartCount = 5; // Change this based on your actual cart count

function TopBar() {
  return (
    <div className="topNavbar">
      <div className="title">Canteen HUB</div>
      {userLoggedIn && (
        <div className="cart">
          <IoCartOutline color="#FAB317" size={25} />
          <div className="cart-count">{cartCount}</div>
        </div>
      )}
    </div>
  );
}

export default TopBar;
