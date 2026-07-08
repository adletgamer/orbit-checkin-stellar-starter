import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../../lib/apiUrl";
import { parseTransactionError } from "./transaction.errors";

export type CounterState =
  | { status: "loading"; total: number | null }
  | { status: "ready"; total: number }
  | { status: "error"; total: number | null; message: string };

export function useCheckInCounter() {
  const [state, setState] = useState<CounterState>({ status: "loading", total: null });

  const refresh = useCallback(async () => {
    setState((current) => ({ status: "loading", total: current.total }));

    try {
      const response = await fetch(apiUrl("/api/counter"), {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Counter unavailable");
      }

      const payload = (await response.json()) as { total: number };
      setState({ status: "ready", total: payload.total });
    } catch (error) {
      const friendly = parseTransactionError(error);
      setState((current) => ({
        status: "error",
        total: current.total,
        message: friendly.message,
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    state,
    total: state.total ?? 0,
    refresh,
    setTotal: (total: number) => setState({ status: "ready", total }),
  };
}
