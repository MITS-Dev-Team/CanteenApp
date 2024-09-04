import { IoArrowBackOutline ,IoCheckmarkDoneCircleOutline} from 'react-icons/io5';
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../../supabase';

function QrCode(){
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const order_id = order?.order_id;
    const user_id = order?.user_id;
    const token = order?.token;
    const items = order?.items;
    const [scanned, setScanned] = useState(false);
    


    const fetchScanStatus = async () => { 
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', order_id)
            .eq('user_id', user_id)
            .single();
        if(data){
            setScanned(data.scanned);
            console.log(scanned);
        }
    }

    //start polling the fetchScanStatus and stop when scanned is true or coomponent is unmounted or order is null
    useEffect(() => { 
        const interval = setInterval(() => {
            fetchScanStatus();
        }, 1000);
        return () => clearInterval(interval);
    }
    , [scanned, order]);


    // //if scanned is true, navigate to the orders page
    // useEffect(() => {
    //     if(scanned){
    //         navigate('/orders');
    //     }
    // }, [scanned]);






    return(
    <div className=" flex flex-col justify-center h-screen items-center lg:max-w-[720px]  lg:justify-center lg:items-center" >
      <div className="flex w-full gap-x-[70%] ">
        <IoArrowBackOutline 
          size={35}
        className="text-white ml-4 text-2xl -mt-5 cursor-pointer"
          onClick={
            () => {
              navigate('/orders');
            }

          } />

      </div>
        <div className='text-white text-2xl font-semibold mb-5'>Order details</div>
        
        <div className='mt-2 w-[80%] self-center 
                        border-2 border-white border-opacity-20 rounded-xl                        
                        bg-white/20 backdrop-blur-sm
                        flex flex-col justify-center items-center bg'>
          <div className='text-white text-2xl font-semibold  mt-6 opacity-90'>Token number {token}</div>
          <div className='w-[300px] h-[300px] border-10 flex flex-col 
                          justify-center items-center
                          rounded-sm bg-transparent '>

          {!scanned ? (
                      <QRCode
                      size={230}
                      value={
                          JSON.stringify({
                              order_id: order_id,
                              user_id: user_id
                          })
                      }
                      bgColor='transparent'
                      fgColor='white'
                      level='M'
                     />
          ): (
            <div className='flex flex-col justify-center items-center w-full h-full'>
              <div className='flex justify-center items-center w-28 h-28 rounded-full bg-green-500'>
                <IoCheckmarkDoneCircleOutline size={100} color='white'/>
              </div>
              <div className='text-white text-2xl font-semibold mt-2 opacity-90'>Order Scanned 😇 </div>
            </div>


          )
          }

          </div>
          {
            <div className='flex w-[98%] h-max flex-wrap'>
            {
              Object.keys(items)?.map((item) => (
                <div className='flex gap-2 items-center w-full h-5 justify-center font-bold opacity-90'>
                    <span className='text-white'>x{items[item].count}</span>
                    <span className='text-white'>{items[item].name}</span>
                </div>
            ))
            }
            </div>
           }
           <div className='text-white text-2xl font-bold mt-2 opacity-100'>₹ {order.amount}</div>
           <div className='text-white text-1xl font-semibold mt-2 mb-3 opacity-80'> { new Date(order.created_at).toDateString()}</div>

        </div>


        
        <div className="mt-5 w-[80%] max-w-full min-h-[6vh] max-h-[7vh] border-white/20 border-2 mb-2 rounded-lg flex flex-col text-white/90 justify-center text-center bg-white/10 backdrop-blur-md shadow-2xl cursor-pointer overflow-hidden" onClick={() => navigate("/")}>
          <div className="productsans-regular opacity-90 flex flex-row justify-center w-[90%] self-center gap-4 z-50 ">
            <span>Return Home</span>
          </div>
        </div>

    </div>
    )
}


export default QrCode;