// src/aptos/CrowdfundingAPI.js

function toUtf8Bytes(str) {
  return Array.from(new TextEncoder().encode(str));
}

export async function submitProposal(wallet, title, description, milestoneCount) {
  if (!wallet || !wallet.signAndSubmitTransaction) throw new Error("Wallet not connected");

  const payload = {
    type: "entry_function_payload",
    function: "0xaa6595e8788da34bd0971ef76bfc59ce05297676a512cef320624be6648c4dad::GuardianAngel::submit_proposal", // Replace 0x1 with your deployed Move module address
    type_arguments: [],
    arguments: [toUtf8Bytes(title), toUtf8Bytes(description), milestoneCount],
  };

  return wallet.signAndSubmitTransaction(payload);
}

export async function vote(wallet, proposalId) {
  if (!wallet || !wallet.signAndSubmitTransaction) throw new Error("Wallet not connected");

  const payload = {
    type: "entry_function_payload",
    function: "0xaa6595e8788da34bd0971ef76bfc59ce05297676a512cef320624be6648c4dad::GuardianAngel::vote",
    type_arguments: [],
    arguments: [proposalId],
  };

  return wallet.signAndSubmitTransaction(payload);
}

export async function releaseMilestone(wallet, proposalId) {
  if (!wallet || !wallet.signAndSubmitTransaction) throw new Error("Wallet not connected");

  const payload = {
    type: "entry_function_payload",
    function: "0x1::GuardianAngel::release_milestone",
    type_arguments: [],
    arguments: [proposalId],
  };

  return wallet.signAndSubmitTransaction(payload);
}
