import React, { useState } from "react";
import { Link } from "react-router-dom";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: "#2563eb", padding: "1rem" }}>
      <div style={{
        maxWidth: 1200,
        margin: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "white",
        fontWeight: "bold",
        fontSize: "1.25rem"
      }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>GuardianAngel DAO</Link>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ color: "white", marginRight: 16 }}>Home</Link>
          <Link to="/submit" style={{ color: "white", marginRight: 16 }}>Submit</Link>
          <Link to="/vote" style={{ color: "white", marginRight: 16 }}>Vote</Link>
          <Link to="/admin" style={{ color: "white", marginRight: 16 }}>Admin</Link>

          {/* Wallet connect button */}
          <WalletSelector />
        </div>
      </div>
      
      {/* (Optional) You can add responsive menu for mobile here */}
    </nav>
  );
}
