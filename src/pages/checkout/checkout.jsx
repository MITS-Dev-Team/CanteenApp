import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import { SiRazorpay } from "react-icons/si";
import useRazorpay from "react-razorpay";
import { useSelector } from "react-redux";
import ProfilePhoto from "../../components/ProfilePhoto";
import { SessionContext } from "../../components/SessionContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addToCart,
  clearCart,
  getItems,
  removeFromCart,
} from "../../redux/cartSlice";
import supabase from "../../supabase";
import PaymentProcessLoadScreen from "../../components/PaymentProcessLoadScreen";

const BACKEND_URL = process.env.REACT_APP_BACKEND_ORDER_URL;

function CheckoutCard(cartItems) {
  return (
    <div className="w-full flex-col text-white max-h-[50vh] scrollbar-hide rounded-xl overflow-y-scroll">
      {cartItems.cartItems &&
        Object.keys(cartItems.cartItems).map((key) => {
          const item = cartItems.cartItems[key];
          console.log(item);
          return (
            <div className="self-center mt-4 bg-[#F9F9F9]/15 backdrop-blur-md rounded-xl overflow-y-scroll">
              <div className="flex justify-between items-left p-3 mt-1 mb-1 w-full">

                <div className="flex flex-col gap-2">
                  <span className="text-3xl productsans-regular opacity-[95%]">{item.name}</span>
                  <span className="text-xl productsans-regular text-left opacity-[75%]">
                    Count :  {item.count}
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-right mt-2 opacity-[95%]">
                  <span className="text-xl productsans-regular">
                    Cost :  ₹ {item.cost}
                  </span>
                  <span className="text-2xl productsans-regular text-right">
                    Total : ₹ {item.cost * item.count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

function Checkout() {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [Razorpay] = useRazorpay();
  const [paymentloadscreenmessage, setPaymentLoadScreenMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  console.log(session);

  const navigate = useNavigate();

  if (!session) {
    navigate("/");
  }

  const avatarInfo = session?.user.user_metadata;
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = Object.values(cartItems).reduce(
    (total, item) => total + item.count,
    0
  );





  const dispatch = useDispatch();


  const getPaymentResponseOnSuccess = async (paymentId, orderId, signature) => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .eq("status", "paid")
      .single();

    if (data) {
      console.log("Order already captured");
      setCompleted(true);
      dispatch(clearCart());
    }else{
      const paymentResponse = await axios
      .post(
        `${BACKEND_URL}/create-order/capture`,
        {
          paymentId,
          signature,
          orderId,
          status: "paid",
          items: cartItems,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )
      .catch((error) => {
        console.error("Error capturing payment");
        setPaymentLoadScreenMessage(
          `Payment Failed, 
          Use the order id to contact the support team: ${orderId},
          Payment Id: ${paymentId}`
        );
      });

    if (paymentResponse && paymentResponse.status === 200) {
      console.log(paymentResponse);
      setCompleted(true);
      dispatch(clearCart());
    }
    }

    
  };

  const createOrder = async () => {
    const response = await axios.post(
      `${BACKEND_URL}/create-order`,
      {
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
    let response = null;
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
        await getPaymentResponseOnSuccess(paymentId, orderId, signature);
      },
      modal: {
        ondismiss: function () {
          setPaymentLoadScreenMessage("Payment Cancelled");
          setTimeout(() => {
            setPaymentLoadScreenMessage("");
            setLoading(false);
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

      setPaymentLoadScreenMessage("Payment Failed");
      setTimeout(() => {
        setPaymentLoadScreenMessage("");
        setLoading(false);
      }, 500);
    });

    rzp.open();
  }, [Razorpay]);
  

  let convenienceFees = (
    Object.values(cartItems).reduce(
      (total, item) => total + item.cost * item.count,
      0
    ) * 0.02
  ).toFixed(2);

  convenienceFees = parseFloat(convenienceFees);

  const total =
    Object.values(cartItems).reduce(
      (total, item) => total + item.cost * item.count,
      0
    ) + convenienceFees;

  return (
    <div className="p-4 max-h-screen">
      <div className="relative left-0">
        <IoArrowBackOutline
          className="text-white text-2xl mt-12 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
          size={35}
        />
      </div>
      <div className="menu-screen-title mt-7 ">
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

        <div className="flex justify-start items-center opacity-[95%] w-full mt-5 gap-3 text-white text-2xl font-bold">
          <span>Checkout</span>
          <MdOutlinePayment size={30} />
        </div>
      </div>

      <CheckoutCard cartItems={cartItems} />
      {loading && (
        <PaymentProcessLoadScreen
          paymentloadscreenmessage={paymentloadscreenmessage}
          completed={completed}
          setCompleted={setCompleted}
          setLoading={setLoading}
          
        />
      )}

       <div className="productsans-regular flex flex-col w-[92%] gap-1 mb-5  items-center absolute bottom-1 text-white left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col justify-center items-center gap-2 ">
          <span className="text-2xl font-bold">Total: ₹ {total}</span>
        </div>
        <span className="text-md text-center">Convenience Fees : ₹ {convenienceFees}</span>
        <button
          className="mt-2 bg-[#0e3d8e] text-white p-2 h-12 rounded-xl w-full flex justify-center items-center gap-2"
          style={{ maxWidth: '400px', boxShadow: '0 4px 50px rgba(0, 0, 0, 0.8)' }}
          onClick={handlePayment}>
          <SiRazorpay size={25} />
          <span className="text-xl font-bold">Pay</span>
        </button>
       </div>
    </div>
  );
}

export default Checkout;
