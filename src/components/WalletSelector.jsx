// src/components/WalletSelector.jsx
import React from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { WalletSelector as AntdWalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

const wallets = [new PetraWallet(), new MartianWallet() /* add more if desired */];

export default function WalletSelector() {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
      <AntdWalletSelector />
    </AptosWalletAdapterProvider>
  );
}
