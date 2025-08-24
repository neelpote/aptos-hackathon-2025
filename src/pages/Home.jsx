import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { vote } from "../aptos/CrowdfundingAPI";
import styles from "./Home.module.css";

const APTOS_NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const CONTRACT_ADDRESS = "0x90e596eac0fc74a918d50bec41302526ffccba403d4112dd11306a9cd4f485ab";
const RESOURCE_TYPE = `${CONTRACT_ADDRESS}::angel::Crowdfunding::ProposalStore`;

export default function Home() {
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
      await fetchProposals();
    } catch (err) {
      alert("Failed to submit vote: " + err.message);
    }
    setVotingProposalId(null);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>GuardianAngel Proposals</h1>

      {loading && <p className={styles.loading}>Loading proposals...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {proposals.length === 0 && !loading && <p className={styles.empty}>No proposals found.</p>}

      <div className={styles.grid}>
        {proposals.map((p, idx) => (
          <div key={idx} className={styles.card}>
            <h2 className={styles.cardTitle}>{new TextDecoder().decode(new Uint8Array(p.title))}</h2>
            <p className={styles.cardDescription}>
              {new TextDecoder().decode(new Uint8Array(p.description))}
            </p>
            <div className={styles.stats}>
              <span>Votes: {p.vote_count}</span>
              <span>
                Milestones: {p.current_milestone} / {p.milestone_count}
              </span>
            </div>
            <button
              onClick={() => handleVote(idx)}
              disabled={votingProposalId === idx}
              className={styles.voteButton}
            >
              {votingProposalId === idx ? "Voting..." : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
