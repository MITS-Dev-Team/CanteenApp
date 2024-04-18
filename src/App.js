import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/landing";
import "./App.css";
import Menu from "./pages/menu/menu";
import Cart from "./pages/cart/cart";
import Profile from "./pages/profile/profile";
import Checkout from "./pages/checkout/checkout";
import Orders from "./pages/orders/orders";
import EggLoading from "./static/eggloading";
import supabase from "./supabase";
import {SessionContext} from "./components/SessionContext";
import { store } from "./redux/store";
import { Provider } from "react-redux";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // setLoading(false) // This is not needed as we are already checking for session in the next useEffect
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your sign-in logic
    const checkSignInStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate a delay
      setLoading(false);
    };

    checkSignInStatus();
  }, []);

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

          </Routes>
        </Router>
      </SessionContext.Provider>
    </Provider>
  );
}

export default App;
