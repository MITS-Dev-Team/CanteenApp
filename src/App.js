import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/landing";
import "./App.css";
import Menu from "./pages/menu/menu";
import EggLoading from "./static/eggloading";
import supabase from "./supabase";
import {SessionContext} from "./components/SessionContext";
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
    <SessionContext.Provider value={{ session, setSession }}>
      <Router>
        <Routes>
          <Route path="/" element={session ? <Menu /> : <Landing />} />
        </Routes>
      </Router>
    </SessionContext.Provider>
  );
}

export default App;
