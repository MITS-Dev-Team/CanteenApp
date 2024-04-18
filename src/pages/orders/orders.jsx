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

function OrderItemCard({ order,setShowQR,setQrData }) {
    const items = order.items;
    return (
        <div className={`flex flex-row w-full  bg-white/20 backdrop-blur-sm text-white justify-between pl-4  rounded-xl border-2 ${order.served ?   'border-green-600' : 'border-red-700'}`}
        onClick={() => {
          if(order.served){
            return
          }
          setShowQR(true);
          setQrData(
            {
              order_id:order.order_id,
              user_id:order.user_id
            }
          );
      }}
        >
          <div className="flex flex-col w-1/2 pt-2 pb-2 ">
            {Object.keys(items).map((key) => (
                <div className="flex w-full justify-start gap-x-2 " >
                    <span className="text-lg font-bold">x{items[key].count}</span>
                    <span className="text-lg font-bold">{key}</span>
                </div>

            )
            )}
            <span className="text-base">Total ₹ {order.amount}</span>
            <span className="text-base ">{
                new Date(order.created_at).toDateString()
            }</span>
          </div>
          <div className="overflow-hidden h-28 justify-end self-end ">
            {order.served ? 
            <TiTick size={200} className=" relative -right-14 -top-12  "/> :
            <HiOutlineQrCode size={150} className=" relative -right-10 -top-2 -rotate-12  "/>
}
          </div>
        </div>
    );
}


function ConfirmDialogue({ isOpen, setIsOpen,qrData}) {
  const navigate = useNavigate();
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70">
        <Dialog.Panel className="w-full max-w-lg min-h-40 rounded-2xl bg-[#F9F9F9]/20 backdrop-blur-2xl text-white">
          <Dialog.Title className="text-2xl font-bold text-center mt-4">QR Code</Dialog.Title>
          <Dialog.Description className="text-center mt-4 text-lg">
            Use this QR Code to recieve your order
          </Dialog.Description>
          <div className="flex flex-col justify-center items-center gap-4 mt-8 mb-4">
            <QR
              color="#FFFFFF"
              rounding={100}
              errorCorrection="H"
              className="w-3/4 h-3/4"
            >
              {JSON.stringify(qrData)}
            </QR>

            <button
              onClick={() => setIsOpen(false)}
              className=" border-2 border-white bg-white/30 text-white px-4 py-2 rounded-md outline-0"
            >
              Ok
            </button>

          </div>

      
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

function Orders(){
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const { session } = React.useContext(SessionContext);
    const [showQR, setShowQR] = useState(false);
    const [qrData, setQrData] = useState({});
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
            .order('created_at', { ascending: false });
            
        if (error) {
            console.log(error);
        } else {
            setOrders(orders);
            console.log(orders);
        }
    }



    return (
    <div className="menu-screen">
      <div className="flex w-full gap-x-[70%] mt-3">
        <IoArrowBackOutline className="text-white text-2xl mt-5 cursor-pointer"
          onClick={
            () => {
              navigate(-1);
            }

          } />

      </div>

      <ConfirmDialogue isOpen={showQR} setIsOpen={setShowQR} qrData={qrData} />
      <div className="mt-10 text-3xl">
        <span style={{ color: "#ffff" }} className="grifter-regular">
          MITS Eatzz
        </span>
        <br />
        <div
          className=" flex justify-start items-center 
            w-full mt-5 gap-3 text-white text-xl font-bold">
            <TbReceipt size={20}/>
          <span>My Orders</span>
        </div>
      </div>
        <div className="flex flex-col w-full gap-4 mt-10">
            {orders.map((order) => (
            <OrderItemCard order={order} key={order.id} setShowQR={setShowQR} setQrData={setQrData}/>
            ))}
        </div>
    </div>
    )
}

export default Orders;