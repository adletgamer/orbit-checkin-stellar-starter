export type TransactionState =
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "awaiting_signature" }
  | { status: "submitting" }
  | { status: "confirming"; hash?: string }
  | { status: "success"; hash: string; newTotal: number }
  | { status: "rejected" }
  | { status: "error"; code: string; message: string; title: string; technical?: string };

export type PreparedTransaction = {
  xdr: string;
  networkPassphrase: string;
};

export type TransactionResult = {
  hash: string;
  newTotal: number;
};
