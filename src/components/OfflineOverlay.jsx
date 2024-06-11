import React, { useState, useEffect } from 'react';

const OfflineOverlay = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    
    <div className='w-screen h-screen 
    left-0 top-0 flex flex-col 
    items-center justify-center
    bg-white/20 backdrop-blur-xl  text-white fixed z-50 bg-opacity-90   
    text-2xl poppins-regular text-center p-4
    gap-20
    '>
        <p
         className='
         text-4xl grifter-regular
         
         '>MITS CANTEEN</p>
        <div>
            <h1 className='text-4xl poppins-regular'>Offline</h1>
            <p>Sorry, you need to be online to use this application.</p>
        </div>
    </div>
  );
};

export default OfflineOverlay;