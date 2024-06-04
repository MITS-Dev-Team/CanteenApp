import { Dialog } from "@headlessui/react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdShoppingCart,MdOutlinePayment } from "react-icons/md";
import { SiRazorpay } from "react-icons/si";
import useRazorpay from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../components/SessionContext";
import {
  addToCart,
  clearCart,
  getItems,
  removeFromCart,
} from "../../redux/cartSlice";
import incrementSound from "../../static/increment.wav";
import PopSound from "../../static/pop.mp3";

const incrementSoundEffect = new Audio(incrementSound);
const PopSoundEffect = new Audio(PopSound);



const BACKEND_URL = process.env.REACT_APP_BACKEND_ORDER_URL;

const Dish = ({ id, name, cost, image, type, initCount,limit,stock }) => {
  const [isAdded, setIsAdded] = useState(initCount > 0 ? true : false);
  const [count, setCount] = useState(initCount || 0);
  const dispatch = useDispatch();

  const getCartItems = useSelector(getItems).payload.cart.items;

  useEffect(() => {
    console.log(getCartItems[name]);
  }, [getCartItems]);

  const handleAddClick = () => {
    setCount(count + 1);
    setIsAdded(true);
    dispatch(addToCart({ name, cost, image, type }));
  };

  const handleIncrement = () => {
    setIsAdded(true);
    //set 20% limit on stock

    if (initCount >= limit || count >= limit || initCount >= stock) {
      return;
    }
    setCount(count + 1);
    dispatch(addToCart({id,name, cost, image, type,count:count }));
    incrementSoundEffect.play();

  };

  const handleDecrement = () => {
    setCount(count - 1);
    if (count === 1) {
      setIsAdded(false);
    }
    dispatch(removeFromCart({id,name, cost, image, type}));
    if(count <= 1){
      PopSoundEffect.play();
    }else{
      incrementSoundEffect.play();
    }

  };

  return (
    <div className="dish-card mt-5 ">
      <div className="dish-left">
        <span>
          <GrRadialSelected
            color={type ? "#27DB97" : "#F42C39"}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: "10px",
            }}
          />
          <span
            className="productsans-regular dish-name"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            {name}
          </span>
        </span>
        <span className="dish-price">₹{cost}</span>
        <span className="dish-price">Total : ₹{cost * count}</span>
      </div>
      <img className="dish-image" src={image} alt={name} />

      {isAdded && initCount >= 1 ? (
        <div className="absolute right-12 w-1/4 h-1/4  -bottom-3 flex justify-center items-center text-center rounded-md">
          <span
            onClick={handleDecrement}
            className="productsans-regular w-1/3 h-full bg-[#2B2B2B] rounded-l-md flex items-center justify-center transition duration-500 ease-in-out cursor-pointer"
          >
            -
          </span>
          <span className="productsans-regular px-2 w-1/3 text-black bg-slate-50 h-full flex items-center justify-center transition duration-500 ease-in-out">
            {count}
          </span>
          <span
            onClick={handleIncrement}
            className="productsans-regular h-full text-white w-1/3 bg-[#2B2B2B] min-h-full rounded-r-md flex items-center justify-center transition duration-500 ease-in-out cursor-pointer"
          >
            +
          </span>
        </div>
      ) : (
        <div
          onClick={handleIncrement}
          className="absolute  right-12 w-1/4 h-1/4 bg-slate-50 -bottom-3 flex justify-center items-center text-center rounded-md text-black font-bold transition duration-500 ease-in-out cursor-pointer"
        >
          ADD
        </div>
      )}
    </div>
  );
};

function CartDishes() {
  const cartItems = useSelector((state) => state.cart.items);
  console.log(cartItems);
  if (Object.keys(cartItems).length === 0) {
    return (
      <div className="flex  justify-center items-center mt-20 min-h-2/3 max-h-4/5">
        <span
          style={{ color: "#AEADAD", fontWeight: 100 }}
          className="poppins-regular text-center text-xl"
        >
          Cart is empty. Add Some Food And it will show up here
        </span>
      </div>
    );
  } 
  return (
    <div
      className="
            flex-col gap-10 w-full  overflow-y-scroll 
            min-h-[55%] max-h-[60%]
        "
    >
      {Object.keys(cartItems).map((item) => {
        return (
          <Dish
            key={item}
            id={item}
            name={cartItems[item].name}
            cost={cartItems[item].cost}
            image={cartItems[item].image}
            type={cartItems[item].type}
            initCount={cartItems[item].count}
            limit={cartItems[item].order_limit}
          />
        );
      })}
    </div>
  );
}

function Cart() {
  const { session } = useContext(SessionContext);

  if (!session) {
    window.location.href = "/";
  }

  const avatarInfo = session?.user.user_metadata;
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = Object.values(cartItems).reduce(
    (total, item) => total + item.count,
    0
  );

  const amount = Object.values(cartItems).reduce(
    (total, item) => total + item.count * item.cost,
    0
  );
  const navigate = useNavigate();
  return (
    <div className="p-4 max-h-screen">
      <div className="relative left-0">
        <IoArrowBackOutline
          className="text-white text-2xl mt-12 cursor-pointer"
          onClick={() => {
            navigate('/');
          }}
          size={35}
        />
        {/* <ProfilePhoto avatarInfo={avatarInfo} className="self-end right-0" /> */}
      </div>
      <div className="menu-screen-title mt-3">
        <span style={{ color: "#ffff" }} className="grifter-regular">
          MITS Canteen
        </span>
        <br />
        <span
          style={{ color: "#AEADAD", fontWeight: 100 }}
          className="poppins-regular"
        >
          Dining Redefined
        </span>
        <div
          className=" flex justify-start items-center 
            w-full mt-5 gap-3 text-white text-xl font-bold"
        >
          <MdShoppingCart style={{ color: "#ffff" }} size={40} />
          <span>My Cart</span>
        </div>
      </div>
      <CartDishes />
      {itemCount && (
        <div className="w-full flex flex-col">
          <div className="absolute bottom-8 w-[98%] self-center justify-center text-center">
            <span className="text-white text-2xl font-semibold mt-5 w-full text-center">
              Total : ₹{amount}
            </span>
            <div
              className="flex justify-center gap-4 items-center w-full h-14
                 rounded-xl mt-5 bg-[#1BA671] drop-shadow-xl
                  text-white text-2xl font-bold
                  cursor-pointer"
              onClick={
                () => {
                  navigate("/checkout");
                }
              }
            >
              <span>Checkout</span>
              <MdOutlinePayment size={30} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
