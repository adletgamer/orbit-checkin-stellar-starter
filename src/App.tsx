import { motion } from "framer-motion";
import { ArrowRight, Check, Code2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CheckInCard } from "./components/checkin/CheckInCard";
import { AppHeader, OrbitMark } from "./components/layout/AppHeader";
import { AppShell } from "./components/layout/AppShell";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";
import { Toast } from "./components/ui/Toast";
import { copy } from "./content/copy";
import { demoStateOrder, demoStates, mockData, type DemoState, type DemoStateId } from "./features/demo/demoStates";
import { useCheckIn } from "./features/checkin/useCheckIn";
import { useCheckInCounter } from "./features/checkin/useCheckInCounter";
import { transactionPrimaryLabel, transactionSteps } from "./features/checkin/transactionMachine";
import { useWallet } from "./features/wallet/useWallet";
import { env } from "./lib/env";
import { cn } from "./utils/classNames";

function OrbitalDiagram() {
  return (
    <div className="mt-8 rounded-3xl border border-border-subtle bg-surface/45 p-4">
      <div className="relative mx-auto flex max-w-md items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border-subtle bg-background/45 px-4 py-5">
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-28 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        {["You", "Freighter", "Contract"].map((item, index) => (
          <div key={item} className="relative z-10 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-surface-elevated font-mono text-xs text-text-primary">
              {index + 1}
            </span>
            <span className="hidden text-sm font-semibold text-text-secondary sm:inline">{item}</span>
            {index < 2 ? <ArrowRight size={15} className="text-text-muted" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoControls({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (state: DemoStateId) => void;
}) {
  return (
    <details className="mx-auto mt-10 max-w-7xl px-5 pb-8 sm:px-8">
      <summary className="cursor-pointer text-sm font-semibold text-text-muted transition hover:text-text-secondary">
        Demo state controls
      </summary>
      <div className="mt-4 grid gap-2 rounded-2xl border border-border-subtle bg-surface/60 p-3 sm:grid-cols-2 lg:grid-cols-4">
        {demoStateOrder.map((stateId) => (
          <button
            key={stateId}
            type="button"
            onClick={() => onSelect(stateId)}
            className={cn(
              "rounded-xl border px-3 py-2 text-left text-sm transition",
              current === stateId
                ? "border-primary bg-primary/12 text-text-primary"
                : "border-border-subtle bg-surface-elevated/50 text-text-secondary hover:border-border-strong",
            )}
          >
            {demoStates[stateId].label}
          </button>
        ))}
      </div>
    </details>
  );
}

function buildCardState({
  wallet,
  transaction,
  demoOverride,
  connected,
}: {
  wallet: ReturnType<typeof useWallet>;
  transaction: ReturnType<typeof useCheckIn>["state"];
  demoOverride: DemoStateId | null;
  connected: boolean;
}): DemoState {
  if (demoOverride) return demoStates[demoOverride];

  if (env.VITE_APP_MODE === "demo" && connected && transaction.status === "idle") {
    return {
      ...demoStates["wallet-connected"],
      title: "Demo mode ready",
      description: "Freighter is connected. The check-in result is simulated for the tutorial.",
      networkLabel: "Demo Testnet",
      action: "Demo mode",
      walletConnected: true,
    };
  }

  if (wallet.state.status === "connecting") return demoStates["wallet-connecting"];

  if (wallet.state.status === "error") {
    const stateId = wallet.state.code === "freighter_not_installed" ? "freighter-not-installed" : "signature-rejected";
    return {
      ...demoStates[stateId],
      title: wallet.state.title,
      description: wallet.state.message,
    };
  }

  if (wallet.state.status === "wrong_network") return demoStates["wrong-network"];

  if (transaction.status === "success") {
    return {
      ...demoStates.success,
      transactionHash: transaction.hash,
      primaryLabel: "Check-in confirmed",
      walletConnected: connected,
    };
  }

  if (transaction.status === "rejected") return demoStates["signature-rejected"];

  if (transaction.status === "error") {
    return {
      ...demoStates["rpc-error"],
      title: transaction.title,
      description: transaction.message,
      primaryLabel: "Try again",
      steps: transactionSteps(transaction),
      walletConnected: connected,
    };
  }

  const base = connected ? demoStates["wallet-connected"] : demoStates["wallet-disconnected"];

  return {
    ...base,
    id: transaction.status === "idle" ? base.id : "preparing",
    title:
      transaction.status === "preparing"
        ? "Preparing check-in"
        : transaction.status === "awaiting_signature"
          ? "Waiting for signature"
          : transaction.status === "submitting" || transaction.status === "confirming"
            ? "Confirming transaction"
            : base.title,
    description:
      transaction.status === "preparing"
        ? "Your browser is building the contract call."
        : transaction.status === "awaiting_signature"
          ? "Review the request in Freighter before signing."
          : transaction.status === "submitting" || transaction.status === "confirming"
            ? "Testnet is recording your check-in."
            : base.description,
    action: transaction.status === "idle" ? base.action : transactionPrimaryLabel(transaction, connected),
    tone: transaction.status === "idle" ? base.tone : "info",
    walletConnected: connected,
    walletLoading: false,
    networkLabel: wallet.session?.network.name || "Stellar Testnet",
    networkOk: wallet.session?.network.isTestnet ?? true,
    primaryLabel: transactionPrimaryLabel(transaction, connected),
    primaryDisabled: ["preparing", "awaiting_signature", "submitting", "confirming"].includes(transaction.status),
    steps: transactionSteps(transaction),
  };
}

export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const [demoOverride, setDemoOverride] = useState<DemoStateId | null>(null);

  function pushToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  const wallet = useWallet(pushToast);
  const counter = useCheckInCounter();
  const checkIn = useCheckIn({
    total: counter.total,
    setTotal: counter.setTotal,
    onMessage: pushToast,
  });

  const demoMode = env.VITE_APP_MODE === "demo";
  const connected = wallet.isConnected;
  const walletAddress = wallet.session?.address;
  const cardState = useMemo(
    () =>
      buildCardState({
        wallet,
        transaction: checkIn.state,
        demoOverride,
        connected,
      }),
    [checkIn.state, connected, demoOverride, wallet],
  );

  async function primaryAction() {
    setDemoOverride(null);

    if (!connected) {
      await wallet.connect();
      return;
    }

    await checkIn.run(demoMode ? null : wallet.session);
  }

  return (
    <AppShell>
      <AppHeader connected={connected} loading={wallet.isConnecting} address={walletAddress} onConnect={wallet.connect} />
      <main className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[52fr_48fr] lg:gap-16 lg:py-12">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl"
        >
          <Badge tone={demoMode ? "warning" : "neutral"}>{demoMode ? "Demo mode" : copy.heroBadge}</Badge>
          <h1 className="mt-5 max-w-2xl font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.035em] text-text-primary sm:text-6xl">
            {copy.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">{copy.description}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={connected ? primaryAction : wallet.connect} className="sm:min-w-44">
              {connected && demoMode ? "Run demo check-in" : copy.actions.connect}
            </Button>
            <a href={mockData.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex">
              <Button type="button" variant="secondary" icon={<Code2 size={16} />} className="w-full sm:w-auto">
                {copy.actions.viewSource}
              </Button>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {copy.indicators.map((indicator) => (
              <span key={indicator} className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <Check size={15} className="text-success" />
                {indicator}
              </span>
            ))}
          </div>

          <OrbitalDiagram />
        </motion.section>

        <div className="flex justify-center lg:justify-end">
          <CheckInCard
            state={cardState}
            total={counter.total}
            walletAddress={walletAddress}
            contractId={env.VITE_CONTRACT_ID || mockData.contractId}
            onConnect={wallet.connect}
            onPrimaryAction={primaryAction}
            onCopy={pushToast}
          />
        </div>
      </main>
      <section id="tutorial" className="sr-only" aria-label={copy.descriptor}>
        <OrbitMark />
      </section>
      {demoMode ? <DemoControls current={demoOverride || "wallet-connected"} onSelect={setDemoOverride} /> : null}
      <Toast message={toast} />
    </AppShell>
  );
}
