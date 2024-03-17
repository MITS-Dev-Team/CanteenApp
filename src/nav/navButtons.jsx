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

function Nav() {
  const [value, setValue] = useState(0);

  return (
    <div className="nav-container">
      <BottomNavigation
        className="bottomNavbar"
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Menus"
          icon={<IoFastFoodOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          label="Todays"
          icon={<IoRestaurantOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          label="Cart"
          icon={<IoCartOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          label="Order"
          icon={<IoClipboardOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          label="Person"
          icon={<IoPersonOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          label="QR Code"
          icon={<IoQrCodeOutline size={20} color={color} />}
        />
      </BottomNavigation>
    </div>
  );
}

export default Nav;
