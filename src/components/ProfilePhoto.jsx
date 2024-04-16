import { Popover, Transition } from '@headlessui/react';
import supabase from '../supabase';
import {useNavigate} from 'react-router-dom';
import { useState } from 'react'; 

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
      <Popover className=" fixed right-1 max-w-2xl max-h-[40vh]  min-h-[8vh] min-w-fit top-10  ">
  
        <Popover.Button className="absolute right-2 w-16 h-16 z-10 ">
          <img
            src={avatarUrl}
            alt="profile"
            className="profile-pic "
          />
        </Popover.Button>
        <Transition
          enter="transition duration-20 ease-in-out"
          enterFrom="transform scale-90 opacity-1"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
        <Popover.Panel className=" w-[95vw] h-[25vh] right-0 rounded-xl  bg-[#F9F9F9]/50 backdrop-blur-xl ">
  

          <div className="p-4 flex-col w-[80%] h-[90%] " >
            <div className=" text-3xl   font-bold ">Hi,</div>
            <div className=" text-3xl  font-bold ">{name}</div>
            <div className=" text-sm font-normal mt-4">Email </div>
            <div className=" text-sm   font-normal">{email}</div>
          </div>
          <div className="flex flex-row gap-20 rounded-md absolute bottom-5 pl-10">
            <span className="productsans-regular text-white text-base w-32 rounded-lg p-1 text-center bg-black cursor-pointer"
              onClick={() => navigate("/profile")}
            >Profile</span>
            <span className="productsans-regular text-white text-base w-20 rounded-lg p-1 text-center bg-red-600 cursor-pointer"
              onClick={logout}
            >Logout</span>
          </div>
        </Popover.Panel>
        </Transition>
      </Popover>
    );
  };


export default ProfilePhoto;