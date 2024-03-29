import React, { useState,useEffect,useContext} from "react";
import supabase from "../../supabase";
import { CiSearch } from "react-icons/ci";
import { MdShoppingCart } from "react-icons/md";
import chickenBiriyaniImage from "../../static/food_images/biriyani.png";
import { GrRadialSelected } from "react-icons/gr";
import {SessionContext} from "../../components/SessionContext"
import { addToCart,removeFromCart,getItems } from "../../redux/cartSlice";
import { useDispatch,useSelector} from 'react-redux';
import { IoArrowBackOutline } from "react-icons/io5";

const ProfilePhoto = (avatarUrl) => {
    return (
      <>
        <img
          src={avatarUrl.avatarUrl}
          alt="profile"
          className="profile-pic"
        />
      </>
    );
  };

  const Dish = ({id,name,cost,image,type,initCount}) => {
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
      setCount(count + 1);
      dispatch(addToCart({id,name, cost, image, type,count:count }));
  
    };
  
    const handleDecrement = () => {
      setCount(count - 1);
      if (count === 1) {
        setIsAdded(false);
      }
      dispatch(removeFromCart({id,name, cost, image, type}));
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
          <span className="dish-price">Total : ₹{cost*count}</span>
        </div>
        <img
          className="dish-image"
          src={image}
          alt={name}
        />

        {
          isAdded && count >= 1 ? (
            <div className="absolute right-12 w-1/4 h-1/4  -bottom-3 flex justify-center items-center text-center rounded-md">
                <span
                    onClick={handleDecrement}
                    className="productsans-regular w-1/3 h-full bg-[#2B2B2B] rounded-l-md flex items-center justify-center transition duration-500 ease-in-out cursor-pointer"
                >
                    -
                </span>
                <span className="productsans-regular px-2 w-1/3 text-black bg-slate-50 h-full flex items-center justify-center transition duration-500 ease-in-out">{count}</span>
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
          )
        }
      </div>
    );
  };


function CartDishes() {
    const cartItems = useSelector((state) => state.cart.items);
    console.log(cartItems)
    if(Object.keys(cartItems).length === 0){
        return (
            <div className="flex mt-[50%] justify-center items-center h-4/5">
            <span
            style={{ color: "#AEADAD", fontWeight: 100 }}
            className="poppins-regular text-center text-xl"
             >Cart is empty. Add Some Food And it will show up here
            </span>

            </div>
        )
    }
    return (
        <div className="
            flex-col gap-10 w-full  overflow-y-auto
            min-h-[45vh] max-h-[75vh]
        "> 
        {
            Object.keys(cartItems).map((item) => {
                return (
                    <Dish
                    key={item}
                    id={item}
                    name={cartItems[item].name}
                    cost={cartItems[item].cost}
                    image={cartItems[item].image}
                    type={cartItems[item].type}
                    initCount={cartItems[item].count}
                    />
                )
            }
            )
        }
        </div>
  
    )

}

function Cart() {
    const {session} = useContext(SessionContext);
    console.log(session);

    const avatarUrl = session?.user.user_metadata.avatar_url;
    const cartItems = useSelector((state) => state.cart.items);
    const itemCount = Object.values(cartItems).reduce((total, item) => total + item.count, 0);
    return (
    <div className="menu-screen">
        <div className="flex w-full gap-x-[70%]">
            <IoArrowBackOutline className="text-white text-2xl mt-5 cursor-pointer"
            onClick={
                () => {
                    window.history.back();
                }
            
            }/>
            <ProfilePhoto avatarUrl={avatarUrl} className="self-end right-0"/>

        </div>
        <div className="mt-10 text-3xl">
        <span style={{ color: "#ffff" }} className="grifter-regular">
            CANTEEN HUB
        </span>
        <br />
        <div
            className=" flex justify-start items-center 
            w-full mt-5 gap-3 text-white text-xl font-bold">
            <MdShoppingCart style={{ color: "#ffff" }} size={40} />
            <span>My Cart</span>
        </div>
        </div>
        <CartDishes/>
        {itemCount && (<div className="
            flex justify-center items-center
            w-full h-12
            rounded-xl
            mt-4
            bg-[#1CA672]
            drop-shadow-greengoblin
            text-base
            font-bold
            cursor-pointer
        ">
            PROCEED CHECKOUT : ₹ {Object.values(cartItems).reduce((total, item) => total + item.count*item.cost, 0)}
        </div>
        ) }
    </div>
    );
}

export default Cart;
