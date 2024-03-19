import "./topBar.css";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import {
  IoFastFoodOutline,
  IoRestaurantOutline,
  IoCartOutline,
  IoClipboardOutline,
  IoPersonOutline,
  IoQrCodeOutline,
} from "react-icons/io5";
import "./navButtons.css";

const color = "#FAB317";

function BottomNavigator() {
  const [value, setValue] = useState(0);

  return (
    <div className="nav-container">
      <BottomNavigation
        className="bottomNavbar min-h-20"
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          className="nav-action"
          label="Todays menu"
          icon={<IoRestaurantOutline size={30} color={color} />}
        />
        <BottomNavigationAction
          className="nav-action"
          label="Cart"
          icon={<IoCartOutline size={30} color={color} />}
        />
        <BottomNavigationAction
          className="nav-action"
          label="Order"
          icon={<IoClipboardOutline size={30} color={color} />}
        />
        <BottomNavigationAction
          className="nav-action"
          label="Profile"
          icon={<IoPersonOutline size={30} color={color} />}
        />
      </BottomNavigation>
    </div>
  );
}

const cartCount = 5; // Change this based on your actual cart count

export function TopBar() {
  const userLoggedIn = useSelector((state) => state.user);
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

export default BottomNavigator;
