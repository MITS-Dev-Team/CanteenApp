import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/landing";
import TopBar from "./nav/topBar";
import "./App.css";

function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/" element={<TodaysMenu />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
