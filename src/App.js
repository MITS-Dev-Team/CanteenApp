import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "./pages/landing/landing";
import TopBar from "./nav/topBar";
import "./App.css";
import Nav from "./nav/navButtons";

function App() {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/" element={<TodaysMenu />} /> */}
      </Routes>
      {user && <Nav />}
    </Router>
  );
}

export default App;
