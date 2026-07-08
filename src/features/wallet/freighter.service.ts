import {
  getAddress,
  getNetworkDetails,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import { TESTNET_PASSPHRASE } from "../../lib/stellar";
import type { WalletSession } from "./wallet.types";

type FreighterResponseError = {
  error?: {
    message?: string;
  };
};

function hasFreighterError(response: FreighterResponseError) {
  return Boolean(response.error);
}

function ensureOk<T extends FreighterResponseError>(response: T, fallback: string): T {
  if (hasFreighterError(response)) {
    throw new Error(response.error?.message || fallback);
  }

  return response;
}

function isTestnetNetwork(network: string, networkPassphrase: string) {
  return network.toLowerCase().includes("testnet") || networkPassphrase === TESTNET_PASSPHRASE;
}

export async function detectFreighter() {
  const connection = await isConnected();
  ensureOk(connection, "Freighter is not installed");
  return connection.isConnected;
}

export async function connectFreighter(): Promise<WalletSession> {
  const detected = await detectFreighter();

  if (!detected) {
    throw new Error("Freighter is not installed");
  }

  const access = ensureOk(await requestAccess(), "Connection request was not approved.");
  const network = ensureOk(await getNetworkDetails(), "Network details are unavailable.");

  return {
    address: access.address,
    network: {
      name: network.network,
      passphrase: network.networkPassphrase,
      isTestnet: isTestnetNetwork(network.network, network.networkPassphrase),
    },
  };
}

export async function restoreFreighterSession(): Promise<WalletSession | null> {
  try {
    const detected = await detectFreighter();
    if (!detected) return null;

    const address = ensureOk(await getAddress(), "Address unavailable.");
    if (!address.address) return null;

    const network = ensureOk(await getNetworkDetails(), "Network details are unavailable.");

    return {
      address: address.address,
      network: {
        name: network.network,
        passphrase: network.networkPassphrase,
        isTestnet: isTestnetNetwork(network.network, network.networkPassphrase),
      },
    };
  } catch {
    return null;
  }
}

export async function signWithFreighter(
  xdr: string,
  address: string,
  networkPassphrase: string = TESTNET_PASSPHRASE,
) {
  const signed = ensureOk(
    await signTransaction(xdr, {
      address,
      networkPassphrase,
    }),
    "Signature request was rejected.",
  );

  return signed.signedTxXdr;
}
