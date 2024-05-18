import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderWait.css';
function OrderWaits() {
    const navigate = useNavigate();
    return (
        <div className="min-w-full max-w-full min-h-[6vh] border-[#FCD97F] 
                        border-2   mb-2 rounded-lg flex flex-col text-white 
                        justify-center text-center bg-[#FCD97F]/20
                        backdrop-blur-sm shadow-2xl cursor-pointer  overflow-hidden
                        "
            onClick={() => navigate("/orders")}         
                        >
            <div className="flex flex-row justify-center w-[90%] self-center gap-5 z-50">
                <img src="/pan.png" alt="" className="h-6 w-6" />
                <span className="text-lg">Bon appétit! Your order awaits</span>
            </div>
        </div>
    );
}

export default OrderWaits;