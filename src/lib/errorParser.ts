export type FriendlyError = {
  code: string;
  title: string;
  message: string;
  technical?: string;
};

export function parseError(error: unknown): FriendlyError {
  const raw = error instanceof Error ? error.message : String(error || "");
  const message = raw.toLowerCase();

  if (message.includes("not installed") || message.includes("not detected")) {
    return {
      code: "freighter_not_installed",
      title: "Freighter is not installed",
      message: "Install the wallet extension to continue with the tutorial.",
      technical: raw,
    };
  }

  if (message.includes("reject") || message.includes("cancel") || message.includes("denied")) {
    return {
      code: "signature_rejected",
      title: "Signature cancelled",
      message: "Nothing was submitted. Your wallet and funds remain unchanged.",
      technical: raw,
    };
  }

  if (message.includes("network") || message.includes("testnet")) {
    return {
      code: "wrong_network",
      title: "Switch to Stellar Testnet",
      message: "This tutorial does not use Mainnet or real funds.",
      technical: raw,
    };
  }

  if (message.includes("contract") || message.includes("invalid contract")) {
    return {
      code: "contract_unavailable",
      title: "Contract unavailable",
      message: "The tutorial contract may need to be redeployed after a Testnet reset.",
      technical: raw,
    };
  }

  if (message.includes("timeout") || message.includes("expired")) {
    return {
      code: "timeout",
      title: "The transaction expired",
      message: "Prepare a new check-in and sign it again.",
      technical: raw,
    };
  }

  if (message.includes("rpc") || message.includes("failed to fetch")) {
    return {
      code: "rpc_unavailable",
      title: "Testnet is not responding",
      message: "Wait a moment and try the request again.",
      technical: raw,
    };
  }

  if (message.includes("configuration") || message.includes("environment")) {
    return {
      code: "configuration",
      title: "Starter configuration is incomplete",
      message: "Review the environment variables in the project README.",
      technical: raw,
    };
  }

  return {
    code: "unknown",
    title: "Something went wrong",
    message: "Try again in a moment.",
    technical: raw,
  };
}
