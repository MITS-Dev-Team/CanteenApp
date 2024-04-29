import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SessionContext } from "../../components/SessionContext"
import { addToCart, removeFromCart, getItems } from "../../redux/cartSlice";
import { useDispatch, useSelector } from 'react-redux';
import supabase from "../../supabase";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdShoppingCart } from "react-icons/md";
import { TbReceipt } from "react-icons/tb";
import { Dialog } from "@headlessui/react";
import { HiOutlineQrCode } from "react-icons/hi2";
import { QR } from "react-qr-rounded";
import { TiTick } from "react-icons/ti";
import EggLoading from "../../static/eggloading";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const BACKEND_URL = process.env.REACT_APP_BACKEND_ORDER_URL;

async function generateToken(order) {

    //highest token number
    const { data, error } = await supabase.rpc('assign_token', { input_order_id: order.order_id });
    const newOrder = { ...order, token: data };
    return newOrder;
}

function OrderItemCard({ order}) {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const items = order.items;
    return (
      <div className="flex flex-col justify-center items-center max-w-[90vw]  min-w-[90vw]    " >
        <div className={`flex flex-row z-20 w-full bg-white/20 backdrop-blur-sm text-white justify-between pl-4  rounded-xl border-2 ${order.served ?   'border-green-600' : 'border-red-700'}`}
          onClick={() => {
          if(order.served){
            return
          }
          }}
        >
          <div className="flex flex-col w-1/3 pt-2 pb-2 ">
            {Object.keys(items).map((key) => (
                <div className="flex w-full justify-start gap-x-2 " >
                    <span className="text-lg font-bold">x{items[key].count}</span>
                    <span className="text-lg font-bold">{key}</span>
                </div>

            )
            )}
            <span className="text-base">Total ₹ {order.amount}</span>
            <span className="text-base ">
              {new Date(order.created_at).toDateString()}
            </span>
          </div>
          {order.token&& !order.served&&(
            <div className="flex w-1/3 flex-col my-4 px-4 border-x-2 text-center justify-center items-center ">
              <div>Token</div>
              <span className="text-lg font-bold">{order.token}</span>
            </div>
          )}

          <div className="overflow-hidden h-28 justify-end self-end w-1/3">
            {order.served ? 
            <TiTick size={200} className=" relative right-4 -top-12  "/> :
            <HiOutlineQrCode size={150} className=" relative -right-5 -top-2 -rotate-12  "/>
            }
          </div>
        </div>
        {!order.served && order.token === null && order.status === "paid" &&
          <div className="w-[60%] h-10 self-center flex flex-col justify-center
                      text-center -mt-2 overflow-hidden bg-green-700/50
                      backdrop-blur-xl rounded-xl z-20 cursor-pointer
                      items-center text-lg"
            onClick={() => {
              setLoading(true);
              generateToken(order).then((newOrder) => {
                  console.log(newOrder);
                  nav(`/qrcode`, { state: { order:newOrder } });
                }
              );
            }}
                          
                          >
            {loading ? <CircularProgress style={{ color: "#fff" }}  size={20}/> : "Generate Token"}
          </div>
        }
        {order.token && !order.served && order.status === "paid" &&
            <div className="w-[60%] h-10 self-center flex flex-col justify-center
                       text-center -mt-2 overflow-hidden bg-green-700/50
                        backdrop-blur-xl rounded-xl z-20 cursor-pointer text-lg"
              onClick={() => {
                nav(`/qrcode`, { state: { order:order } });

              }}        
                            >
              Click to show QR
            </div>
        }
        {
          order.status === "pending" &&
          <div className="w-[60%] h-10 self-center flex flex-col justify-center
                      text-center -mt-2 overflow-hidden bg-red-700
                      backdrop-blur-xl rounded-xl z-20 cursor-pointer text-lg"
            onClick={() => {
              

            }}
          >
            Payment Failed
          </div>

        }
      </div>
    );
}


function Orders(){
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const { session } = React.useContext(SessionContext);
    const [showQR, setShowQR] = useState(false);
    const [qrData, setQrData] = useState({});
    const [loading, setLoading] = useState(false);
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
    <div className="overflow-y-scroll p-4">
      <div className="flex w-full gap-x-[70%] mt-3">
        <IoArrowBackOutline className="text-white text-2xl mt-5 cursor-pointer"
          onClick={
            () => {
              navigate(-1);
            }

          } />

      </div>

      <div className="menu-screen-title mt-10">

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
        <div className="flex flex-col w-full gap-4 mt-5 overflow-y-scroll">
            {orders.length === 0 ? <EggLoading /> : 
            <div className="w-full h-max text-white"> 
              <div className="w-full h-[50%] overflow-y-scroll">
                <p className="text-center mb-2 text-xl font-bold ">Pending Orders</p>
                <div className="flex flex-col gap-4">
                  {orders.filter((order) => !order.served && order.status === 'paid').map((order) => (
                    <OrderItemCard order={order} setShowQR={setShowQR} setQrData={setQrData} />
                  ))}
                  {
                    orders.filter((order) => order.served === false && order.status === 'paid').length === 0 &&
                    <div className="text-center text-sm">No Pending Orders</div>
                  }
                </div>
              </div>
              <div className="w-full h-[50%] mt-10 overflow-y-scroll">
                <p className="text-center mb-2 text-xl font-bold ">Previous Orders</p>
                <div className="flex flex-col gap-4">
                  {orders.filter((order) => order.served || order.status === "pending").map((order) => (
                    <OrderItemCard order={order} setShowQR={setShowQR} setQrData={setQrData} />
                  ))}
                </div>
                </div>
            </div>
                
            }
        </div>
    </div>
    )
}

export default Orders;