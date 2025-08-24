import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { vote } from "../aptos/CrowdfundingAPI";
import styles from "./Vote.module.css";

const APTOS_NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const CONTRACT_ADDRESS = "0x90e596eac0fc74a918d50bec41302526ffccba403d4112dd11306a9cd4f485ab";
const RESOURCE_TYPE = `${CONTRACT_ADDRESS}::angel::Crowdfunding::ProposalStore`;

export default function Vote() {
  const client = new AptosClient(APTOS_NODE_URL);
  const wallet = useWallet();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [votingProposalId, setVotingProposalId] = useState(null);

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

  async function handleVote(proposalId) {
    if (!wallet.connected) {
      alert("Please connect your wallet to vote");
      return;
    }
    setVotingProposalId(proposalId);
    try {
      await vote(wallet, proposalId);
      alert("Vote submitted!");
      await fetchProposals(); // refresh to get updated votes
    } catch (err) {
      alert("Failed to submit vote: " + err.message);
    }
    setVotingProposalId(null);
  }

  return (
    <div className={styles.voteContainer}>
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Vote on Proposals</h1>
      {loading && <p className="text-center text-gray-600">Loading proposals...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {proposals.length === 0 && !loading ? (
        <p className="text-center text-gray-500">No proposals available for voting.</p>
      ) : (
        <div className="max-w-4xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2">
          {proposals.map((p, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col"
            >
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
                onClick={() => handleVote(idx)}
                disabled={votingProposalId === idx}
                className={`py-2 rounded-md font-semibold text-white transition-colors ${
                  votingProposalId === idx ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {votingProposalId === idx ? "Voting..." : "Vote"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
