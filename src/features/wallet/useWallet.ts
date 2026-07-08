import { useCallback, useEffect, useMemo, useState } from "react";
import { connectFreighter, restoreFreighterSession } from "./freighter.service";
import { parseWalletError } from "./wallet.errors";
import type { WalletState } from "./wallet.types";

export function useWallet(onMessage?: (message: string) => void) {
  const [state, setState] = useState<WalletState>({ status: "disconnected" });

  useEffect(() => {
    let mounted = true;

    restoreFreighterSession().then((session) => {
      if (!mounted || !session) return;
      setState(session.network.isTestnet ? { status: "connected", session } : { status: "wrong_network", session });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const connect = useCallback(async () => {
    setState({ status: "connecting" });

    try {
      const session = await connectFreighter();
      setState(session.network.isTestnet ? { status: "connected", session } : { status: "wrong_network", session });
      onMessage?.("Wallet connected");
    } catch (error) {
      const friendly = parseWalletError(error);
      setState({
        status: "error",
        code: friendly.code,
        title: friendly.title,
        message: friendly.message,
      });
      onMessage?.(friendly.title);
    }
  }, [onMessage]);

  const disconnectLocal = useCallback(() => {
    setState({ status: "disconnected" });
  }, []);

  return useMemo(
    () => ({
      state,
      connect,
      disconnectLocal,
      session: "session" in state ? state.session : null,
      isConnected: state.status === "connected",
      isConnecting: state.status === "connecting",
      isWrongNetwork: state.status === "wrong_network",
    }),
    [connect, disconnectLocal, state],
  );
}
