import { useCallback, useMemo, useRef, useState } from "react";
import { env } from "../../lib/env";
import type { WalletSession } from "../wallet/wallet.types";
import { demoCheckIn, prepareCheckIn, signAndSubmitCheckIn } from "./contract.service";
import { parseTransactionError } from "./transaction.errors";
import { isTransactionActive } from "./transactionMachine";
import type { TransactionState } from "./transaction.types";

export function useCheckIn({
  total,
  setTotal,
  onMessage,
}: {
  total: number;
  setTotal: (total: number) => void;
  onMessage?: (message: string) => void;
}) {
  const [state, setState] = useState<TransactionState>({ status: "idle" });
  const activeAccount = useRef<string | null>(null);

  const run = useCallback(
    async (session: WalletSession | null) => {
      if (isTransactionActive(state)) return;

      if (env.VITE_APP_MODE === "demo") {
        setState({ status: "preparing" });
        onMessage?.("Preparing demo check-in");
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        setState({ status: "awaiting_signature" });
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        setState({ status: "confirming" });
        const result = await demoCheckIn(total);
        setTotal(result.newTotal);
        setState({ status: "success", ...result });
        onMessage?.("Demo check-in confirmed");
        return;
      }

      if (!session) {
        throw new Error("Wallet not connected");
      }

      if (!session.network.isTestnet) {
        throw new Error("Switch to Stellar Testnet");
      }

      try {
        activeAccount.current = session.address;
        setState({ status: "preparing" });
        onMessage?.("Preparing transaction");
        const prepared = await prepareCheckIn(session.address);

        if (activeAccount.current !== session.address) {
          throw new Error("Wallet account changed during the request.");
        }

        setState({ status: "awaiting_signature" });
        onMessage?.("Waiting for signature");
        setState({ status: "submitting" });
        const result = await signAndSubmitCheckIn(session.address, prepared);
        setState({ status: "confirming", hash: result.hash });
        setTotal(result.newTotal);
        setState({ status: "success", ...result });
        onMessage?.("Check-in confirmed");
      } catch (error) {
        const friendly = parseTransactionError(error);

        if (friendly.code === "signature_rejected") {
          setState({ status: "rejected" });
          onMessage?.("Signature cancelled");
          return;
        }

        setState({
          status: "error",
          code: friendly.code,
          title: friendly.title,
          message: friendly.message,
          technical: friendly.technical,
        });
        onMessage?.(friendly.title);
      } finally {
        activeAccount.current = null;
      }
    },
    [onMessage, setTotal, state, total],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return useMemo(
    () => ({
      state,
      run,
      reset,
      active: isTransactionActive(state),
    }),
    [reset, run, state],
  );
}
