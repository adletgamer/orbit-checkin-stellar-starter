import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { demoStates, type DemoStateId } from "./demoStates";
import {
  connectFreighter,
  restoreFreighterSession,
} from "../wallet/freighter.service";
import { parseWalletError } from "../wallet/wallet.errors";
import type { WalletSession } from "../wallet/wallet.types";

const flow: DemoStateId[] = ["preparing", "waiting-signature", "confirming", "success"];

export function useDemoFlow() {
  const [stateId, setStateId] = useState<DemoStateId>("wallet-disconnected");
  const [total, setTotal] = useState(1284);
  const [toast, setToast] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletSession | null>(null);
  const timers = useRef<number[]>([]);

  const baseState = demoStates[stateId];
  const state = useMemo(
    () => ({
      ...baseState,
      walletConnected: baseState.walletConnected || Boolean(wallet),
      networkLabel: wallet?.network.name || baseState.networkLabel,
      networkOk: wallet ? wallet.network.isTestnet : baseState.networkOk,
    }),
    [baseState, wallet],
  );

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const pushToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    let mounted = true;

    restoreFreighterSession().then((session) => {
      if (!mounted || !session) return;
      setWallet(session);
      setStateId(session.network.isTestnet ? "wallet-connected" : "wrong-network");
    });

    return () => {
      mounted = false;
    };
  }, []);

  const selectState = useCallback(
    (next: DemoStateId) => {
      clearTimers();
      setStateId(next);
      if (next === "success") {
        setTotal((value) => Math.max(value, 1285));
      }
    },
    [clearTimers],
  );

  const connectWallet = useCallback(async () => {
    clearTimers();
    setStateId("wallet-connecting");

    try {
      const nextWallet = await connectFreighter();
      setWallet(nextWallet);
      setStateId(nextWallet.network.isTestnet ? "wallet-connected" : "wrong-network");
      pushToast("Freighter connected");
    } catch (error) {
      const friendly = parseWalletError(error);
      setWallet(null);
      setStateId(friendly.code === "freighter_not_installed" ? "freighter-not-installed" : "wallet-disconnected");
      pushToast(friendly.title);
    }
  }, [clearTimers, pushToast]);

  const startCheckIn = useCallback(() => {
    if (!state.walletConnected) {
      connectWallet();
      return;
    }

    if (!state.networkOk) {
      setStateId("wallet-connected");
      pushToast("Switched to Stellar Testnet");
      return;
    }

    clearTimers();
    flow.forEach((nextState, index) => {
      timers.current.push(
        window.setTimeout(() => {
          setStateId(nextState);
          if (nextState === "success") {
            setTotal((value) => value + 1);
            pushToast("Check-in confirmed");
          }
        }, index * 720),
      );
    });
  }, [clearTimers, connectWallet, pushToast, state.networkOk, state.walletConnected]);

  const primaryAction = useCallback(() => {
    if (stateId === "freighter-not-installed") {
      window.open("https://www.freighter.app/", "_blank", "noreferrer");
      return;
    }

    if (stateId === "success" && state.transactionHash) {
      window.open("https://lab.stellar.org/transactions", "_blank", "noreferrer");
      return;
    }

    startCheckIn();
  }, [startCheckIn, state.transactionHash, stateId]);

  return useMemo(
    () => ({
      state,
      stateId,
      total,
      toast,
      walletAddress: wallet?.address,
      selectState,
      connectWallet,
      startCheckIn,
      primaryAction,
      pushToast,
    }),
    [
      connectWallet,
      primaryAction,
      pushToast,
      selectState,
      startCheckIn,
      state,
      stateId,
      toast,
      total,
      wallet?.address,
    ],
  );
}
