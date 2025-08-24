import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { submitProposal } from "../aptos/CrowdfundingAPI";

export default function SubmitProposal() {
  const wallet = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet.connected) {
      alert("Please connect your wallet first");
      return;
    }
    setLoading(true);
    try {
      const tx = await submitProposal(wallet, title, description, milestones);
      alert("Proposal submitted! Transaction hash: " + tx.hash);
      setTitle("");
      setDescription("");
      setMilestones(1);
    } catch (error) {
      alert("Error submitting proposal: " + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded shadow space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea"
        required
      />
      <input
        type="number"
        min={1}
        max={20}
        placeholder="Milestones"
        value={milestones}
        onChange={(e) => setMilestones(parseInt(e.target.value))}
        className="input"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Submitting..." : "Submit Proposal"}
      </button>
    </form>
  );
}
