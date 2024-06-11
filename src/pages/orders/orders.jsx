import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { HiOutlineQrCode } from "react-icons/hi2";
import { IoArrowBackOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../components/SessionContext";
import { getItems } from "../../redux/cartSlice";
import EggLoading from "../../static/eggloading";
import supabase from "../../supabase";

const BACKEND_URL = process.env.REACT_APP_BACKEND_ORDER_URL;

async function generateToken(order) {

    //highest token number
    const { data, error } = await supabase.rpc('assign_token', { input_order_id: order.order_id });
    const newOrder = { ...order, token: data };
    return newOrder;
}


const Category = ({ category, selectedCategory, setSelectedCategory }) => {

  return (
    <span
      onClick={() => setSelectedCategory(category)}
      className={`${
        selectedCategory === category ? "category-selected" : ""
      } productsans-regular food-category`}
    >
      {category}
    </span>
  );
};


const OrderPendingCard = ({ order }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-[98%]">
      <div className="flex justify-between items-left w-full bg-white/20  backdrop-blur-xl p-2 rounded-t-xl">
        <div className="flex flex-col gap-2">
          <span className="text-xl poppins-regular"> {order.order_id}</span>
          <span className="text-2xl poppins-regular">
            Total : ₹ {order.amount}
          </span>
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-2xl poppins-regular self-end">
              {order.status}
            </span>
          <span className="text-xl poppins-regular text-right">
           {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
        <div className="flex justify-between items-center w-[100%]">
          {order.token !== null && (
            <div
              className="bg-green-800 text-white px-4 py-2 w-1/3 flex items-center justify-center rounded-bl-xl cursor-pointer border-r-2 transition-all duration-500 ease-in-out"
              onClick={() => {
                navigate(`/qrcode`, {
                  state: { order: order },
                });
              }}
            >
              <HiOutlineQrCode size={40} />
            </div>
          )}
          <div
            className={`bg-green-800 text-white px-4 py-2 h-14 text-xl font-bold text-center flex items-center justify-center rounded-br-xl cursor-pointer transition-all duration-500 ease-in-out ${order.token === null ? 'w-full rounded-bl-xl' : 'w-2/3'}`}
            onClick={() => {
              if (order.token === null && !loading) {
                setLoading(true);
                generateToken(order).then((newOrder) => {
                  setLoading(false);
                  console.log(newOrder);
                  order.token = newOrder.token;

                });
              }else {
                navigate(`/qrcode`, {
                  state: { order: order },
                });
              }

            }}
          >
            {order.token === null ? (
              loading ? (
                <CircularProgress />
              ) : (
                <span>Generate Token</span>
              ) 
            ) : (
              <span>Token : {order.token}</span>
            )}
          </div>
        </div>

    </div>
  );
}

const OrderCompletedCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(order);
  return (
    <div className="w-[98%]">
      <div className="flex justify-between items-left w-full bg-white/20  backdrop-blur-xl p-2 rounded-t-xl">
        <div className="flex flex-col gap-2">
          <span className="text-xl poppins-regular"> {order.order_id}</span>
          <span className="text-2xl poppins-regular">
            Total : ₹ {order.amount}
          </span>
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-2xl poppins-regular self-end">
              {order.status}
            </span>
          <span className="text-xl poppins-regular text-right">
           {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center w-[100%]">
        <div
          className={`bg-white/30 backdrop-blur-lg
              text-white 
              
             items-center justify-center rounded-b-xl 
             cursor-pointer transition-all duration-500 
             ease-in-out w-full py-2
             flex flex-col h-max`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
        <span className=" text-xl font-bold text-center">
          {isExpanded ? "Hide" : "Show"} Items
        </span>
      
      
            <div className={`flex w-full h-max flex-wrap 
            p-2 mt-2 border-t-2 transition-all 
            ease-in-out duration-500
            ${isExpanded ? "border-white " : "border-transparent hidden"}
            `}>
              {Object.values(order.items).map((item) => (
                <div className="flex  gap-2 items-center w-full h-5 justify-between font-bold">
                  <div className="flex justify-between gap-2">
                    <span className="text-white">x{item.count}</span>
                    <span className="text-white">{item.name}</span>
                  </div>
                  <div>
                    <span className="text-white">₹ {item.cost}</span>
                  </div>


                </div>
              ))}
            </div>
  
      
      </div>
      </div>

    </div>
  )
}

const OrderFailedCard = ({ order }) => {
  return (
    <>
      <div className="w-[98%]">
        <div className="flex justify-between items-left w-full bg-white/20  backdrop-blur-xl p-2 rounded-t-xl">
          <div className="flex flex-col gap-2">
            <span className="text-xl poppins-regular"> {order.order_id}</span>
            <span className="text-2xl poppins-regular">
              Total : ₹ {order.amount}
            </span>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="text-2xl poppins-regular self-end">
              {order.status}
            </span>
            <span className="text-xl poppins-regular text-right">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center w-[100%]">
          <div
            className={`bg-orange-700 text-white px-4 py-2 h-14 text-xl font-bold text-center flex items-center justify-center rounded-b-xl cursor-pointer transition-all duration-500 ease-in-out w-full`}
          >
            <span>Payment Failed</span>
          </div>
        </div>
      </div>
    </>
  )  
}


function Orders(){
    const navigate = useNavigate();
    const [orders, setOrders] = useState(null);
    const { session } = React.useContext(SessionContext);
    const [showQR, setShowQR] = useState(false);
    const [qrData, setQrData] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Pending");

    const dispatch = useDispatch();
    const cart = useSelector(getItems);

    React.useEffect(() => {
        if (session) {
            fetchOrders();
        }
        }
    , [session]);

    const fetchOrders = async () => {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('served', { ascending: true })
            .order('created_at', { ascending: false })
            
        if (error) {
            console.log(error);
        } else {
            setOrders(orders);
            console.log(orders);
        }
    }



    return (
      <div className="h-screen w-full p-3 overflow-y-scroll ">
        <div className="flex w-full gap-x-[70%] mt-6">
          <IoArrowBackOutline
            className="text-white text-2xl mt-5 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
            size={35}
          />
        </div>

        <div className="menu-screen-title mt-8">
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
        </div>
        <div className="flex flex-col w-full gap-4 mt-5">
          {orders === null ? (
            <EggLoading />
          ) : orders.length === 0 ? (
            <div className="text-[#AEADAD] text-xl text-center mt-[20vh] poppins-regular ">
              Nothing yet, order some food and it will show up here 😌
            </div>
          ) : (
            <div>
              <div className="menu-categories">
                {["Pending", "Completed", "Failed"].map((category) => (
                  <Category
                    key={category}
                    category={category}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-4 text-white items-center justify-center w-full mt-4">
                {orders.map((order) => (
                  (selectedCategory === "Pending" &&
                    order.status === "paid" &&
                    order.served === false) && (
                    <OrderPendingCard order={order} />
                  )
                ))}
                {selectedCategory === "Pending" && orders.filter((order) => order.status === "paid" && order.served === false).length === 0 && (
                  <div className="text-[#AEADAD] text-xl text-center mt-[20vh] poppins-regular ">
                    No pending orders
                  </div>
                )}


                {orders.map((order) => (
                  (selectedCategory === "Completed" &&
                    order.status === "paid" &&
                    order.served === true) && (
                    <OrderCompletedCard order={order} />
                  )
                ))}
                {selectedCategory === "Completed" && orders.filter((order) => order.status === "paid" && order.served === true).length === 0 && (
                  <div className="text-[#AEADAD] text-xl text-center mt-[20vh] poppins-regular ">
                    No completed orders
                  </div>
                )}

                {orders.map((order) => (
                  (selectedCategory === "Failed" &&
                    order.status === "pending") && (
                    <OrderFailedCard order={order} />
                  )
                ))}
                {selectedCategory === "Failed" && orders.filter((order) => order.status === "pending").length === 0 && (
                  <div className="text-[#AEADAD] text-xl text-center mt-[20vh] poppins-regular ">
                    No failed orders
                  </div>
                )}
              </div>


            </div>
          )}
        </div>
      </div>
    );
}

export default Orders;