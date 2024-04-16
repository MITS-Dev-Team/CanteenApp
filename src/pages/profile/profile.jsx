import React from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useContext } from 'react';
import { SessionContext } from '../../components/SessionContext';
import ProfilePhoto from '../../components/ProfilePhoto';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { session } = useContext(SessionContext);
    console.log(session);
    if (!session) {
      window.location.href = "/";
    }
  
    const avatarInfo = session?.user.user_metadata;
    const cartItems = useSelector((state) => state.cart.items);
    const itemCount = Object.values(cartItems).reduce((total, item) => total + item.count, 0);
    return (
      <div className="menu-screen">
        <div className="flex w-full gap-x-[70%] mt-3">
          <IoArrowBackOutline className="text-white text-2xl mt-5 cursor-pointer"
            onClick={
              () => {
                window.history.back();
              }
  
            } />
  
        </div>
        <div className="mt-10 text-3xl">
          <span style={{ color: "#ffff" }} className="grifter-regular">
            CANTEEN HUB
          </span>
          <br />

        </div>

      </div>
    );
};

export default Profile;