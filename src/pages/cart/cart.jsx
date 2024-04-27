import React, { useState, useEffect, useContext, useCallback } from "react";
import supabase from "../../supabase";
import { MdShoppingCart } from "react-icons/md";
import { GrRadialSelected } from "react-icons/gr";
import { SessionContext } from "../../components/SessionContext";
import {
  addToCart,
  removeFromCart,
  getItems,
  clearCart,
} from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackOutline } from "react-icons/io5";
import ProfilePhoto from "../../components/ProfilePhoto";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import useRazorpay from "react-razorpay";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { SiRazorpay } from "react-icons/si";
import GooglePayButton from "@google-pay/button-react";
const BACKEND_URL = process.env.REACT_APP_BACKEND_ORDER_URL;

const Dish = ({ id, name, cost, image, type, initCount }) => {
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
    dispatch(addToCart({ id, name, cost, image, type, count: count }));
  };

  const handleDecrement = () => {
    setCount(count - 1);
    if (count === 1) {
      setIsAdded(false);
    }
    dispatch(removeFromCart({ id, name, cost, image, type }));
  };

  return (
    <div className="dish-card h-14 mt-5 ">
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
      <div className="flex mt-[50%] justify-center items-center h-4/5">
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
            min-h-[45vh] max-h-[55vh]
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
          />
        );
      })}
    </div>
  );
}

function ConfirmDialogue({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70">
        <Dialog.Panel className="w-full max-w-lg min-h-40 rounded-2xl bg-[#F9F9F9]/20 backdrop-blur-2xl text-white">
          <Dialog.Title className="text-2xl font-bold text-center mt-4">
            Order Placed Successfully
          </Dialog.Title>
          <Dialog.Description className="text-center mt-4 text-lg">
            Track your order
          </Dialog.Description>
          <div className="flex justify-center items-center gap-4 mt-8 mb-4">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/");
              }}
              className="bg-white/40 text-white px-4 py-2 rounded-md "
            >
              Go Back
            </button>
            <button
              onClick={() => {
                setIsOpen(false);

                navigate("/orders");
              }}
              className="bg-white/40 text-white px-4 py-2 rounded-md"
            >
              Orders
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
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
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [afterpaymentload, setAfterPaymentLoad] = useState(false);
  const [paymentloadscreenmessage, setPaymentLoadScreenMessage] = useState(
    "Please wait while we process your payment"
  );
  const [Razorpay] = useRazorpay();
  const amount = Object.values(cartItems).reduce(
    (total, item) => total + item.count * item.cost,
    0
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createOrder = async () => {
    const response = await axios.post(
      `${BACKEND_URL}/create-order`,
      {
        amount: amount * 100,
        description: "Payment for food",
        user_id: session.user.id,
        user_name: avatarInfo.full_name,
        items: cartItems,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
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
    var response = null;
    try {
      response = await createOrder();
    } catch (error) {
      console.error("Error creating order");
      setLoading(false);
      return;
    }

    if (response.status !== 200) {
      console.error("Error creating order");
      return;
    }

    const order = response.data;
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: order.amount,
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
          `${BACKEND_URL}/create-order/capture`,
          {
            paymentId,
            signature,
            orderId,
            amount: order.amount / 100,
            status: "paid",
            items: cartItems,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        if (paymentResponse.status !== 200) {
          console.error("Error capturing payment");
          return;
        }
        console.log(paymentResponse);
        if (paymentResponse.data.resp.status === 200) {
          dispatch(clearCart());
          setAfterPaymentLoad(false);
          setIsOpen(true);
        }
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setPaymentLoadScreenMessage("Payment Cancelled. Please try again");
          //show message for half a second then close the modal
          setTimeout(() => {
            setAfterPaymentLoad(false);
          }, 500);
        },
      },
      theme: {
        color: "#1CA672",
      },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
      setLoading(false);
      setPaymentLoadScreenMessage("Payment Failed. Please try again");
      setAfterPaymentLoad(false);
    });
    rzp.open();
    setLoading(false);
    setAfterPaymentLoad(true);
  }, [Razorpay]);

  const PaymentProcessLoadScreen = () => {
    if (afterpaymentload) {
      return (
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg min-h-40 rounded-2xl bg-[#F9F9F9]/20 backdrop-blur-2xl text-white">
            <div className="text-2xl font-bold text-center mt-4">
              Processing Payment
            </div>
            <div className="text-center mt-4 text-lg">
              {paymentloadscreenmessage}
            </div>
            <div className="flex justify-center items-center gap-4 mt-8 mb-4">
              <CircularProgress style={{ color: "#fff" }} size={24} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="menu-screen">
      <ConfirmDialogue isOpen={isOpen} setIsOpen={setIsOpen} />
      <PaymentProcessLoadScreen />
      <div className="flex w-full gap-x-[70%] mt-3">
        <IoArrowBackOutline
          className="text-white text-2xl mt-5 cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        />
        {/* <ProfilePhoto avatarInfo={avatarInfo} className="self-end right-0" /> */}
      </div>
      <div className="mt-8 flex flex-col">
        <span style={{ color: "#ffff" }} className="grifter-regular  text-3xl">
          MITS Canteen
        </span>
        <span className="poppins-regular text-[#AEADAD] ">
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
        <div className="min-w-screen flex flex-col">
          <span className="text-white text-2xl font-semibold mt-5 min-w-screen text-center">
            Total : ₹{amount}
          </span>
          <div
            className="flex justify-center gap-4 items-center w-full h-14
               rounded-xl mt-5 bg-[#064793] drop-shadow-xl
                text-white text-base font-bold 
                cursor-pointer"
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
      )}
    </div>
  );
}

export default Cart;
