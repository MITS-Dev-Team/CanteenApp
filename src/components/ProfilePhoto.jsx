import { Popover, Transition } from '@headlessui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';

const ProfilePhoto = (avatarInfo) => {
    const name  = avatarInfo.avatarInfo.name;
    const avatarUrl = avatarInfo.avatarInfo.avatar_url;
    const email = avatarInfo.avatarInfo.email;
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const logout = async () => {
      await supabase.auth.signOut();
      navigate("/");
    }

    return (
      <Popover className="relative -top-44   left-0 max-w-[100%] max-h-[40vh]  min-h-[5vh] min-w-[100%]  z-[200] ">
  
        <Popover.Button className="absolute left-2 w-16 h-16 z-10 top-6 outline-none">
          <img
            src={
              avatarUrl || `https://api.dicebear.com/8.x/fun-emoji/png?seed=${name}`
            }
            alt="profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-white/50 bg-white bg-opacity-50 hover:bg-opacity-100 hover:shadow-xl transition duration-200 ease-in-out cursor-pointer"
          />
        </Popover.Button>

        <div className="absolute top-12 right-2.5 w-7 h-7 flex flex-col items-center justify-center text-white cursor-pointer gap-2"
          onClick={()=>{
            navigate("/cart")
          }}>
        <img src="/cart-icon2.svg" className="opacity-75 w-10 h-10" alt="cart" />
        <span className='productsans-regular opacity-50 text-sm'>Cart</span>
      </div>

        <div className="absolute top-12 right-16 w-7 h-7 flex flex-col items-center justify-center text-white cursor-pointer gap-2"
          onClick={()=>{
            navigate("/orders")
          }}>
        <img src="/order.svg" className="opacity-80 w-10 h-10" alt="orders" />
        <span className='productsans-regular opacity-50 text-sm'>Orders</span>
      </div>
        
        <Transition
          enter="transition  ease-in-out"
          enterFrom="transform scale-90 "
          enterTo="transform scale-100"
          leave="transition  ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
        
        <Popover.Panel className="mt-3 absolute min-w-[100%] max-w-[720px] min-h-[23vh] max-h-[25vh] rounded-xl shadow-2xl bg-[#F9F9F9]/50 backdrop-blur-lg">

          <div className=" pt-5 pr-5 flex-col w-[100%] h-[90%] text-right justify-center " >
            <div className="productsans-bold text-xl  font-bold ">{name}</div>
            <div className="productsans-regular text-md">{email}</div>
          </div>
          <div className="productsans-regular text-xs pt-1 text-black/50 font-normal pr-5 flex-col w-[100%] h-[90%] text-right justify-center">
            <span>
              Linked with Google account
            </span>
          </div>
          <div className="flex flex-col gap-20 rounded-md absolute bottom-8 min-w-full justify-center items-center text-center ">
            {/* <span className="productsans-regular text-white text-base w-32 rounded-lg p-1 text-center bg-black cursor-pointer"
              onClick={() => navigate("/profile")}
            >Profile</span> */}
            <span className="mt-3 mb-3 productsans-regular text-white text-base w-20 rounded-lg p-1 text-center bg-red-600 cursor-pointer absolute right-4"
              onClick={logout}
            >Logout</span>
          </div>
        </Popover.Panel>
        </Transition>
      </Popover>
    );
  };


export default ProfilePhoto;