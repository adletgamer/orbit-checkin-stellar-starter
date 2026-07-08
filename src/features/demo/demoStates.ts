export type DemoStateId =
  | "wallet-disconnected"
  | "wallet-connecting"
  | "wallet-connected"
  | "wrong-network"
  | "preparing"
  | "waiting-signature"
  | "signature-rejected"
  | "confirming"
  | "success"
  | "rpc-error"
  | "contract-unavailable"
  | "freighter-not-installed";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";
export type StepKey = "prepare" | "sign" | "confirm";
export type StepState = "pending" | "active" | "complete" | "error";

export type DemoState = {
  id: DemoStateId;
  label: string;
  title: string;
  description: string;
  action: string;
  tone: Tone;
  walletConnected: boolean;
  walletLoading?: boolean;
  networkLabel: string;
  networkOk: boolean;
  primaryLabel: string;
  primaryDisabled?: boolean;
  showSkeleton?: boolean;
  transactionHash?: string;
  steps: Record<StepKey, StepState>;
};

const pendingSteps: Record<StepKey, StepState> = {
  prepare: "pending",
  sign: "pending",
  confirm: "pending",
};

export const demoStates: Record<DemoStateId, DemoState> = {
  "wallet-disconnected": {
    id: "wallet-disconnected",
    label: "Wallet disconnected",
    title: "Wallet not connected",
    description: "Connect Freighter to start the tutorial.",
    action: "Connect Freighter",
    tone: "neutral",
    walletConnected: false,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Connect wallet to continue",
    steps: pendingSteps,
  },
  "wallet-connecting": {
    id: "wallet-connecting",
    label: "Wallet connecting",
    title: "Opening Freighter",
    description: "Approve the connection request in your wallet.",
    action: "Waiting for wallet",
    tone: "info",
    walletConnected: false,
    walletLoading: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Connecting wallet",
    primaryDisabled: true,
    showSkeleton: true,
    steps: pendingSteps,
  },
  "wallet-connected": {
    id: "wallet-connected",
    label: "Wallet connected",
    title: "Ready on Testnet",
    description: "Your wallet is connected and ready to check in.",
    action: "Check in on Testnet",
    tone: "success",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Check in on Testnet",
    steps: pendingSteps,
  },
  "wrong-network": {
    id: "wrong-network",
    label: "Wrong network",
    title: "Switch to Testnet",
    description: "This starter only uses Testnet, so no real funds are involved.",
    action: "Switch network",
    tone: "warning",
    walletConnected: true,
    networkLabel: "Public Network",
    networkOk: false,
    primaryLabel: "Switch to Testnet",
    steps: pendingSteps,
  },
  preparing: {
    id: "preparing",
    label: "Preparing transaction",
    title: "Preparing check-in",
    description: "Your browser is building the contract call.",
    action: "Preparing",
    tone: "info",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Preparing transaction",
    primaryDisabled: true,
    steps: { prepare: "active", sign: "pending", confirm: "pending" },
  },
  "waiting-signature": {
    id: "waiting-signature",
    label: "Waiting signature",
    title: "Waiting for signature",
    description: "Review the request in Freighter before signing.",
    action: "Waiting for signature",
    tone: "info",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Waiting for signature",
    primaryDisabled: true,
    steps: { prepare: "complete", sign: "active", confirm: "pending" },
  },
  "signature-rejected": {
    id: "signature-rejected",
    label: "Signature rejected",
    title: "Signature rejected",
    description: "Nothing was sent. Try again when you are ready.",
    action: "Try again",
    tone: "danger",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Try again",
    steps: { prepare: "complete", sign: "error", confirm: "pending" },
  },
  confirming: {
    id: "confirming",
    label: "Confirming",
    title: "Confirming transaction",
    description: "Testnet is recording your check-in.",
    action: "Confirming transaction",
    tone: "info",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Confirming transaction",
    primaryDisabled: true,
    steps: { prepare: "complete", sign: "complete", confirm: "active" },
  },
  success: {
    id: "success",
    label: "Transaction success",
    title: "Check-in confirmed",
    description: "Your first Stellar action is recorded on Testnet.",
    action: "View in Stellar Lab",
    tone: "success",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Check-in confirmed",
    transactionHash: "9f4b8c7a6e2d91b035a8c42e6f7d3c1b",
    steps: { prepare: "complete", sign: "complete", confirm: "complete" },
  },
  "rpc-error": {
    id: "rpc-error",
    label: "RPC error",
    title: "Network is busy",
    description: "The Testnet connection did not respond. Try again in a moment.",
    action: "Retry check-in",
    tone: "danger",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Retry check-in",
    steps: { prepare: "complete", sign: "complete", confirm: "error" },
  },
  "contract-unavailable": {
    id: "contract-unavailable",
    label: "Contract unavailable",
    title: "Contract unavailable",
    description: "The demo contract cannot be reached right now.",
    action: "Try again",
    tone: "warning",
    walletConnected: true,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Try again",
    steps: { prepare: "error", sign: "pending", confirm: "pending" },
  },
  "freighter-not-installed": {
    id: "freighter-not-installed",
    label: "Freighter not installed",
    title: "Freighter is not installed",
    description: "Install the wallet extension to continue with the tutorial.",
    action: "Install Freighter",
    tone: "warning",
    walletConnected: false,
    networkLabel: "Stellar Testnet",
    networkOk: true,
    primaryLabel: "Install Freighter",
    steps: pendingSteps,
  },
};

export const demoStateOrder = Object.keys(demoStates) as DemoStateId[];

export const mockData = {
  walletAddress: "GDGZXTW36RZPHO3XL2SCCRCYJORJAF2S6TE3IY27X4ZDWVRWLH4XIIFD",
  contractId: "CCX4V2CJLGQH5RMEQGZ7TC3F2R3THYH2SCQKJ6J6Y7ORBITCHECKIN",
  labUrl: "https://lab.stellar.org/transactions",
  sourceUrl: "https://github.com/adletgamer/orbit-checkin-stellar-starter",
};
