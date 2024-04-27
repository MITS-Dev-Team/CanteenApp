import React, { useState, useEffect, useContext, useCallback } from "react";
import supabase from "../../supabase";
import { CiSearch } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import chickenBiriyaniImage from "../../static/food_images/biriyani.png";
import { GrRadialSelected } from "react-icons/gr";
import { SessionContext } from "../../components/SessionContext";
import { addToCart, removeFromCart, getItems } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import ProfilePhoto from "../../components/ProfilePhoto";
import useRazorpay from "react-razorpay";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { SiRazorpay } from "react-icons/si";

function CheckoutCard(cartItems) {
  return (
    <div className="min-w-screen min-h-[40vh] mt-10 rounded-xl bg-[#F9F9F9]/40 backdrop-blur-xl flex-col text-white ">
      {cartItems.cartItems &&
        Object.keys(cartItems.cartItems).map((key) => {
          const item = cartItems.cartItems[key];
          return (
            <div className=" mt-10 self-center">
              <div className="flex flex-col justify-between items-left m-2 w-[90%] ">
                <span className="text-xl poppins-regular">{item.name}</span>
                <span className="text-lg poppins-regular">
                  Quantity : {item.count}
                </span>
              </div>
              <div className="flex justify-between items-center w-[90%s] mt-2">
                <span className="text-lg poppins-regular">{item.count}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

function Checkout() {
  const { session } = useContext(SessionContext);
  console.log(session);
  if (!session) {
    window.location.href = "/";
  }

  const avatarInfo = session?.user.user_metadata;
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = Object.values(cartItems).reduce(
    (total, item) => total + item.count,
    0
  );
  const [loading, setLoading] = useState(false);

  const [Razorpay] = useRazorpay();
  const backendUrl = process.env.REACT_APP_BACKEND_ORDER_URL;
  console.log(backendUrl);
  const amount = Object.values(cartItems).reduce(
    (total, item) => total + item.count * item.cost,
    0
  );

  const createOrder = async () => {
    const response = await axios.post(
      backendUrl,
      {
        amount: amount * 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_EDGE_ANON_KEY}`,
        },
      }
    );
    if (response.status !== 200) {
      console.error("Error creating order");
    }
    console.log(response);
    return response;
  };

  const handlePayment = useCallback(async () => {
    if (!Razorpay) {
      return;
    }
    if (itemCount === 0) {
      alert("Please add items to cart");
      return;
    }
    if (!loading) {
      setLoading(true);
    } else {
      return;
    }
    const response = await createOrder();
    if (response.status !== 200) {
      console.error("Error creating order");
      return;
    }
    const order = response.data;
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: order.amount * 100,
      currency: order.currency,
      name: "MITS Canteen",
      description: "Payment for food",
      order_id: order.id,
      prefill: {
        name: avatarInfo.full_name,
        email: session.user.email,
        contact: avatarInfo.phone_number,
      },
      handler: async (response) => {
        console.log(response);
        const paymentId = response.razorpay_payment_id;
        const signature = response.razorpay_signature;
        const orderId = response.razorpay_order_id;
        const paymentResponse = await axios.post(
          `${backendUrl}/capture`,
          {
            paymentId,
            signature,
            orderId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_EDGE_ANON_KEY}`,
            },
          }
        );
        if (paymentResponse.status !== 200) {
          console.error("Error capturing payment");
          return;
        }
        console.log(paymentResponse);
        alert("Payment successful");
      },
      theme: {
        color: "#1CA672",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
    setLoading(false);
  }, [Razorpay]);

  return (
    <div className="menu-screen">
      <div className="flex w-full gap-x-[70%] mt-3">
        <IoArrowBackOutline
          className="text-white text-2xl mt-5 cursor-pointer"
          onClick={() => {
            window.history.back();
          }}
        />
        <ProfilePhoto avatarInfo={avatarInfo} className="self-end right-0" />
      </div>
      <div className="mt-10 text-3xl">
        <span style={{ color: "#ffff" }} className="grifter-regular">
          MITS Canteen
        </span>
      </div>

      <span
        style={{ color: "#AEADAD", fontWeight: 100 }}
        className="poppins-regular"
      >
        Dining Redefined
      </span>
      <div
        className=" flex justify-start items-center 
            w-full mt-10  gap-3 text-white text-2xl font-bold"
      >
        <MdOutlinePayment style={{ color: "#ffff" }} size={40} />
        <span>Payment Options</span>
      </div>
      <div className="justify-center text-center text-white font-semibold text-xl mt-20 ">
        Total : Rs {amount}
      </div>

      <div
        className="
            flex justify-center items-center
            w-full h-12
            rounded-xl
            mt-2
            bg-[#1CA672]
            drop-shadow-greengoblin
            text-base
            font-bold
            cursor-pointer
        "
      >
        PAY ON ARRIVAL
      </div>

      <div
        className="flex justify-center gap-4 items-center w-full h-14 rounded-xl mt-10 bg-[#064793] drop-shadow-xl text-white text-base font-bold cursor-pointer"
        onClick={handlePayment}
      >
        {loading ? (
          <CircularProgress style={{ color: "#fff" }} size={24} />
        ) : (
          <div className="flex justify-center items-center gap-2">
            <SiRazorpay style={{ color: "#ffff" }} size={24} />
            <span>Pay with Razorpay</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
