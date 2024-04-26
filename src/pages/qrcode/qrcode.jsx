import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate,useLocation } from 'react-router-dom';
import QRCode from "react-qr-code";

function QrCode(){
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const order_id = order?.order_id;
    const user_id = order?.user_id;
    const token = order?.token;
    const items = order?.items;

    console.log(order);
    return(
    <div className=" pt-12 flex flex-col justify-center items-center">
      <div className="flex w-full gap-x-[70%] ">
        <IoArrowBackOutline className="text-white ml-4 text-2xl mt-2 cursor-pointer"
          onClick={
            () => {
              navigate(-1);
            }

          } />

      </div>
        <span style={{ color: "#ffff" }} className=" pl-4 grifter-regular mt-5 text-3xl self-start">
            MITS Canteen
        </span>
        
        <div className='mt-[20%] min-w-[90%] min-h-[60vh] max-h-[70vh] self-center 
                        border-2 border-white rounded-xl
                        bg-white/20 backdrop-blur-sm
                        flex flex-col justify-center items-center bg  '>
          <div className='text-white text-2xl font-semibold mb-1'>Token Number</div>
          <div className='text-white text-2xl font-semibold mb-2'>{token}</div>
          <div className='min-w-[80%] min-h-[35vh] flex flex-col 
                          justify-center items-center border-2 
                          rounded-xl bg-white mb-2'>
          <QRCode
            size={250}
            value={
                JSON.stringify({
                    order_id: order_id,
                    user_id: user_id
                })
            }
            bgColor='white'
            fgColor='black'
            level='L'
           />
          </div>
          {
            Object.keys(items)?.map((item) => (
                <div className='flex gap-2 items-center w-full h-5 justify-center font-bold'>
                    <span className='text-white'>x{items[item].count}</span>
                    <span className='text-white'>{items[item].name}</span>
                </div>
            ))
           }
           <div className='text-white text-2xl font-base mt-2'>₹ {order.amount}</div>
           <div className='text-white text-1xl font-semibold mt-2'> { new Date(order.created_at).toDateString()}</div>

        </div>
        
    </div>
    )
}


export default QrCode;