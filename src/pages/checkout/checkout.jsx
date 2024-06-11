import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useCallback, useContext, useState } from "react";
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

const BACKEND_URL = "https://upisaudoedkmymdeopkk.supabase.co/functions/v1/";


function CheckoutCard(cartItems) {
  return (
    <div className="w-full  flex-col text-white max-h-[50vh] overflow-y-scroll">
      {cartItems.cartItems &&
        Object.keys(cartItems.cartItems).map((key) => {
          const item = cartItems.cartItems[key];
          console.log(item)
          return (
            <div className=" self-center mt-2 bg-[#F9F9F9]/20 backdrop-blur-xl  rounded-xl">
              <div className="flex justify-between items-left p-3 w-full] ">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl poppins-regular">{item.name}</span>
                  <span className="text-xl poppins-regular text-right">
                    Count : x {item.count}
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-right mt-2">
                  <span className="text-xl poppins-regular">
                    Cost :  ₹ {item.cost}
                  </span>
                  <span className="text-2xl poppins-regular text-right">
                    Total : ₹ {item.cost * item.count}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center w-[90%s] mt-2">
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

  if(itemCount === 0){
    navigate('/');
  }


  const [loading, setLoading] = useState(false);
  const [Razorpay] = useRazorpay();
  const [paymentloadscreenmessage, setPaymentLoadScreenMessage] = useState("");

  const dispatch = useDispatch();


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
          setLoading(false);
          navigate("/orders");


        }
      },
      modal: {
        ondismiss: function () {
          //show message for half a second then close the modal
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

      //show message for half a second then close the modal
      setPaymentLoadScreenMessage("Payment Failed");
      setTimeout(() => {
        setPaymentLoadScreenMessage("");
        setLoading(false);
      }, 500);
    });

    rzp.open();
  }, [Razorpay]);


  
  const PaymentProcessLoadScreen = () => {
    return (
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70 z-20">
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
  };

  let convenienceFees = (Object.values(cartItems).reduce(
    (total, item) => total + item.cost * item.count,
    0
  ) * 0.02).toFixed(2);

  convenienceFees = parseFloat(convenienceFees);


  



  const total = Object.values(cartItems).reduce(
    (total, item) => total + item.cost * item.count,
    0
  ) + convenienceFees;


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
      <div className="menu-screen-title mt-7">
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
            w-full mt-5 gap-3 text-white text-2xl font-bold"
        >
          <span>Checkout</span>
          <MdOutlinePayment size={30} />
        </div>
      </div>

        <CheckoutCard cartItems={cartItems} />
        {loading && <PaymentProcessLoadScreen />}

      <div className="flex flex-col  gap-4 mt-8 mb-4 w-[95%] absolute bottom-0 text-white ">
      <span className="text-xl text-center">Convenience Fees : ₹ {convenienceFees}</span>
        <div className="flex  justify-center items-center gap-2 ">

          <span className="text-2xl font-bold">Total</span>
          <span className="text-2xl font-bold">: ₹ {total}</span>
        </div>
        <button
          className="bg-[#0e3d8e] text-white p-2 h-14 rounded-xl w-full flex justify-center items-center gap-2"
          onClick={handlePayment}
        >
          <SiRazorpay size={30} />
          <span className="text-xl font-bold">Pay</span>
        </button>
      </div>
    </div>
  );
}

export default Checkout;
