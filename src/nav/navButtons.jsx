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
          className="nav-action"
          label="Menus"
          icon={<IoFastFoodOutline size={18} color={color} />}
        />
        <BottomNavigationAction
          className="nav-action"
          label="Todays"
          icon={<IoRestaurantOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          className="nav-action"
          label="Cart"
          icon={<IoCartOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          className="nav-action"
          label="Order"
          icon={<IoClipboardOutline size={20} color={color} />}
        />
        <BottomNavigationAction
          className="nav-action"
          label="Person"
          icon={<IoPersonOutline size={20} color={color} />}
        />
        {/* <BottomNavigationAction
          className="nav-action"
          label="QR Code"
          icon={<IoQrCodeOutline size={20} color={color} />}
        /> */}

        {/* Please fix this brooo 😭😭😭😭😭🙏🙏🙏🙏 nav is overflowing with qr code*/}
      </BottomNavigation>
    </div>
  );
}

export default Nav;
