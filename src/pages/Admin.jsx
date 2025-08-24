import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { releaseMilestone } from "../aptos/CrowdfundingAPI";
import styles from "./Admin.module.css";

const APTOS_NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const CONTRACT_ADDRESS = "0x90e596eac0fc74a918d50bec41302526ffccba403d4112dd11306a9cd4f485ab";
const DAO_ADDRESS = "0x90e596eac0fc74a918d50bec41302526ffccba403d4112dd11306a9cd4f485ab";
const RESOURCE_TYPE = `${CONTRACT_ADDRESS}::angel::Crowdfunding::ProposalStore`;

export default function Admin() {
  const client = new AptosClient(APTOS_NODE_URL);
  const wallet = useWallet();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  async function fetchProposals() {
    setLoading(true);
    setError(null);
    try {
      const resource = await client.getAccountResource(CONTRACT_ADDRESS, RESOURCE_TYPE);
      setProposals(resource.data.proposals || []);
    } catch (err) {
      setError("Failed to load proposals");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    if (wallet.connected && wallet.account?.address) {
      setIsAdmin(wallet.account.address.toLowerCase() === DAO_ADDRESS.toLowerCase());
    } else {
      setIsAdmin(false);
    }
  }, [wallet.connected, wallet.account]);

  async function handleRelease(proposalId) {
    if (!wallet.connected) {
      alert("Please connect your wallet as admin.");
      return;
    }
    setProcessingId(proposalId);
    try {
      await releaseMilestone(wallet, proposalId);
      alert("Milestone released!");
      await fetchProposals();
    } catch (err) {
      alert("Failed to release milestone: " + err.message);
    }
    setProcessingId(null);
  }

  if (!isAdmin) {
    return (
      <div className={styles.adminContainer}>
        <p>You must connect with the DAO admin wallet to access this page.</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Admin: Release Milestones</h1>

      {loading && <p className="text-center text-gray-600">Loading proposals...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {proposals.length === 0 && !loading ? (
        <p className="text-center text-gray-500">No proposals available.</p>
      ) : (
        <div className="max-w-4xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2">
          {proposals.map((p, idx) => {
            const canRelease = p.current_milestone < p.milestone_count;
            return (
              <div key={idx} className="bg-white shadow-md rounded-lg p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-3 text-blue-700">
                  {new TextDecoder().decode(new Uint8Array(p.title))}
                </h2>
                <p className="text-gray-700 flex-grow mb-4 line-clamp-4">
                  {new TextDecoder().decode(new Uint8Array(p.description))}
                </p>
                <div className="mb-4 font-semibold text-gray-600 text-sm flex justify-between">
                  <span>Votes: {p.vote_count}</span>
                  <span>
                    Milestones: {p.current_milestone} / {p.milestone_count}
                  </span>
                </div>
                <button
                  onClick={() => handleRelease(idx)}
                  disabled={processingId === idx || !canRelease}
                  className={`py-2 rounded-md font-semibold text-white transition-colors ${
                    processingId === idx || !canRelease
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {processingId === idx
                    ? "Processing..."
                    : canRelease
                    ? "Release Milestone"
                    : "Fully Funded"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
