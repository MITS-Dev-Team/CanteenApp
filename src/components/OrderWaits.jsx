import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderWait.css';
function OrderWaits() {
    const navigate = useNavigate();
    return (
    <div className="min-w-full max-w-full min-h-[7vh] border-[#FCD97F]/40
                border-2 mb-2 rounded-lg flex flex-col text-white 
                justify-center text-center bg-[#FCD97F]/20
                backdrop-blur-sm shadow-2xl cursor-pointer  overflow-hidden
                animate-glow"
     onClick={() => navigate("/orders")}
     >
        <div className="productsans opacity-90 flex flex-row justify-center w-[90%] self-center gap-4 z-50">
            <img src="/pan.png" alt="" className="h-5 w-6 self-center" />
            <span className="text-lg">Bon appétit! Your order awaits</span>
        </div>
    </div>

    );
}

export default OrderWaits;