import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "./pages/landing/landing";
import "./App.css";
import Menu from "./pages/menu/menu";
import EggLoading from "./static/eggloading";

function App() {
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your sign-in logic
    const checkSignInStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
      setLoading(false);
    };

    checkSignInStatus();
  }, []);

  if (loading) {
    return <EggLoading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Menu /> : <Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
