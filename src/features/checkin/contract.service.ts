import {
  BASE_FEE,
  Contract,
  TransactionBuilder,
  scValToNative,
  rpc,
} from "@stellar/stellar-sdk";
import { env, isTestnetConfigured } from "../../lib/env";
import { assertContractId, createRpcServer, TESTNET_PASSPHRASE } from "../../lib/stellar";
import { signWithFreighter } from "../wallet/freighter.service";
import type { PreparedTransaction, TransactionResult } from "./transaction.types";

const DEFAULT_TIMEOUT_SECONDS = 45;

function createContract() {
  assertContractId(env.VITE_CONTRACT_ID);
  return new Contract(env.VITE_CONTRACT_ID);
}

function ensureReady() {
  if (!isTestnetConfigured()) {
    throw new Error("Starter configuration is incomplete");
  }
}

export async function getTotal(sourceAddress: string): Promise<number> {
  ensureReady();

  const server = createRpcServer();
  const account = await server.getAccount(sourceAddress);
  const contract = createContract();
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET_PASSPHRASE,
  })
    .addOperation(contract.call("get_total"))
    .setTimeout(DEFAULT_TIMEOUT_SECONDS)
    .build();

  const simulation = await server.simulateTransaction(tx);

  if (!rpc.Api.isSimulationSuccess(simulation) || !simulation.result) {
    throw new Error("Contract unavailable");
  }

  return Number(scValToNative(simulation.result.retval));
}

export async function prepareCheckIn(sourceAddress: string): Promise<PreparedTransaction> {
  ensureReady();

  const server = createRpcServer();
  const account = await server.getAccount(sourceAddress);
  const contract = createContract();
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET_PASSPHRASE,
  })
    .addOperation(contract.call("check_in"))
    .setTimeout(DEFAULT_TIMEOUT_SECONDS)
    .build();

  const prepared = await server.prepareTransaction(tx);

  return {
    xdr: prepared.toXDR(),
    networkPassphrase: TESTNET_PASSPHRASE,
  };
}

export async function signAndSubmitCheckIn(sourceAddress: string, prepared: PreparedTransaction): Promise<TransactionResult> {
  const server = createRpcServer();
  const signedXdr = await signWithFreighter(prepared.xdr, sourceAddress, prepared.networkPassphrase);
  const signedTx = TransactionBuilder.fromXDR(signedXdr, prepared.networkPassphrase);
  const sent = await server.sendTransaction(signedTx);

  if (sent.status === "ERROR") {
    throw new Error("Transaction rejected by Testnet");
  }

  if (!sent.hash) {
    throw new Error("Testnet is not responding");
  }

  const final = await server.pollTransaction(sent.hash, {
    attempts: 20,
    sleepStrategy: (attempt) => Math.min(1000 + attempt * 250, 3000),
  });

  if (final.status !== "SUCCESS") {
    throw new Error("The transaction expired");
  }

  const newTotal = final.returnValue ? Number(scValToNative(final.returnValue)) : await getTotal(sourceAddress);

  return {
    hash: sent.hash,
    newTotal,
  };
}

export async function demoGetTotal() {
  return 1284;
}

export async function demoCheckIn(currentTotal: number): Promise<TransactionResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
  return {
    hash: "9f4b8c7a6e2d91b035a8c42e6f7d3c1b",
    newTotal: currentTotal + 1,
  };
}
