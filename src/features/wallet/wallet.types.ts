export type WalletNetwork = {
  name: string;
  passphrase: string;
  isTestnet: boolean;
};

export type WalletSession = {
  address: string;
  network: WalletNetwork;
};

export type WalletState =
  | { status: "disconnected" }
  | { status: "connecting" }
  | { status: "connected"; session: WalletSession }
  | { status: "wrong_network"; session: WalletSession }
  | { status: "error"; code: string; title: string; message: string };
