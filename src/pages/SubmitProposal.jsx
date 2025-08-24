import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { submitProposal } from "../aptos/CrowdfundingAPI";
import styles from "./SubmitProposal.module.css";

export default function SubmitProposal() {
  const wallet = useWallet();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneCount, setMilestoneCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [proposalId, setProposalId] = useState(null); // Store returned proposal id

  async function handleSubmit(e) {
    e.preventDefault();

    if (!wallet.connected) {
      alert("Please connect your wallet to submit a proposal.");
      return;
    }

    if (!title.trim() || !description.trim() || milestoneCount <= 0) {
      alert("Please fill all fields with valid values.");
      return;
    }

    setSubmitting(true);
    try {
      // Call on-chain function and capture returned proposal ID or tx hash
      const returnedId = await submitProposal(wallet, title.trim(), description.trim(), milestoneCount);

      if (returnedId) {
         setProposalId(returnedId);
         // Optionally, save returnedId off-chain (e.g., Supabase) here
      }

      alert("Proposal submitted successfully!");
      setTitle("");
      setDescription("");
      setMilestoneCount(1);
    } catch (err) {
      console.error("Submit proposal error:", err);
      alert("Failed to submit proposal: " + (err.message || JSON.stringify(err)));
    }
    setSubmitting(false);
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Submit a New Proposal</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            id="title"
            type="text"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
            placeholder="Enter your proposal title"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            rows={6}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.textarea}
            placeholder="Describe your proposal"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="milestoneCount" className={styles.label}>Number of Milestones</label>
          <input
            id="milestoneCount"
            type="number"
            min={1}
            max={20}
            value={milestoneCount}
            onChange={(e) => setMilestoneCount(Number(e.target.value))}
            required
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={styles.submitButton}
        >
          {submitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>

      {/* Optional: show returned proposal ID */}
      {proposalId && (
        <p className="mt-4 text-green-600">
          Proposal submitted! Proposal ID: {proposalId}
        </p>
      )}
    </div>
  );
}
