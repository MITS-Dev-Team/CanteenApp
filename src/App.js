import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/landing";
import "./App.css";
import Menu from "./pages/menu/menu";
import Cart from "./pages/cart/cart";
import Profile from "./pages/profile/profile";
import Checkout from "./pages/checkout/checkout";
import Orders from "./pages/orders/orders";
import QrCode from "./pages/qrcode/qrcode";
import EggLoading from "./static/eggloading";

import supabase from "./supabase";
import { SessionContext } from "./components/SessionContext";
import { store } from "./redux/store";
import { Provider } from "react-redux";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaPromptVisible, setIsPwaPromptVisible] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkSignInStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate a delay
      setLoading(false);
    };

    checkSignInStatus();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaPromptVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the PWA prompt");
        } else {
          console.log("User dismissed the PWA prompt");
        }
        setDeferredPrompt(null);
        setIsPwaPromptVisible(false);
      });
    }
  };

  if (loading) {
    return <EggLoading />;
  }

  return (
    <Provider store={store}>
      <SessionContext.Provider value={{ session, setSession }}>
        <Router>
          <Routes>
            <Route path="/" element={session ? <Menu /> : <Landing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/qrcode" element={<QrCode />} />
          </Routes>
        </Router>
        {isPwaPromptVisible && (
          <div className="fixed bottom-0 p-4 bg-[#2B2B2B]/60 
                     backdrop-blur-lg text-white/90 
                    text-center rounded-t-xl sha  dow-lg 
                    pwaComponent z-[60]">
            <p className="font-bold">Install this app on your device for a better experience.</p>
            <div className="flex gap-10 self-center justify-center">

              <button
                onClick={() => setIsPwaPromptVisible(false)}
                className="mt-2 px-4 py-2 bg-gray-500 text-white/90 font-semibold rounded   hover:bg-gray-600 transition"
              >
                Cancel        
              </button>
              <button
                onClick={handleInstallClick}
                className="mt-2 px-4 py-2 bg-yellow-600  text-white/90 font-semibold rounded hover:bg-yellow-700 transition"
              >
                Install
              </button>
            </div>

          </div>
        )}
      </SessionContext.Provider>
    </Provider>
  );
}

export default App;
