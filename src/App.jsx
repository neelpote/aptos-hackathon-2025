import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import SubmitProposal from "./pages/SubmitProposal";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";

const wallets = [new PetraWallet()];

function App() {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
      <BrowserRouter>
        <Navbar /> {/* Navbar placed here for access on all routes */}
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans pt-16"> {/* padding for fixed navbar */}
          <div className="p-6 max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitProposal />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AptosWalletAdapterProvider>
  );
}

export default App;
