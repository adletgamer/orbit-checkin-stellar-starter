import type { StepKey, StepState } from "../demo/demoStates";
import type { TransactionState } from "./transaction.types";

export function isTransactionActive(state: TransactionState) {
  return ["preparing", "awaiting_signature", "submitting", "confirming"].includes(state.status);
}

export function transactionPrimaryLabel(state: TransactionState, connected: boolean) {
  if (!connected) return "Connect wallet to continue";

  switch (state.status) {
    case "preparing":
      return "Preparing transaction";
    case "awaiting_signature":
      return "Waiting for signature";
    case "submitting":
    case "confirming":
      return "Confirming transaction";
    case "success":
      return "Check-in confirmed";
    default:
      return "Check in on Testnet";
  }
}

export function transactionSteps(state: TransactionState): Record<StepKey, StepState> {
  switch (state.status) {
    case "preparing":
      return { prepare: "active", sign: "pending", confirm: "pending" };
    case "awaiting_signature":
      return { prepare: "complete", sign: "active", confirm: "pending" };
    case "submitting":
    case "confirming":
      return { prepare: "complete", sign: "complete", confirm: "active" };
    case "success":
      return { prepare: "complete", sign: "complete", confirm: "complete" };
    case "rejected":
      return { prepare: "complete", sign: "error", confirm: "pending" };
    case "error":
      return { prepare: "complete", sign: "complete", confirm: "error" };
    default:
      return { prepare: "pending", sign: "pending", confirm: "pending" };
  }
}
