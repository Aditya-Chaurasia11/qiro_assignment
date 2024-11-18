import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Protocol from "./Pages/Protocol";
import TVLList from "./Pages/TVLList";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/protocol/:id" element={<Protocol />} />
        <Route path="/tvl" element={<TVLList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
