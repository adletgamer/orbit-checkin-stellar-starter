import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { copy } from "../../content/copy";
import { env } from "../../lib/env";
import { mockData, type DemoState } from "../../features/demo/demoStates";
import { cn } from "../../utils/classNames";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { CopyButton } from "../ui/CopyButton";
import { StatusIndicator } from "../ui/StatusIndicator";
import { WalletIdentity } from "../wallet/WalletIdentity";
import { CheckInCounter } from "./CheckInCounter";
import { EducationDisclosure } from "./EducationDisclosure";
import { NetworkStatus } from "./NetworkStatus";
import { TransactionResult } from "./TransactionResult";
import { TransactionStepper } from "./TransactionStepper";

function shortContract(value: string) {
  return `${value.slice(0, 8)}...${value.slice(-8)}`;
}

export function CheckInCard({
  state,
  total,
  onConnect,
  onPrimaryAction,
  onCreateAnother,
  onCopy,
  walletAddress,
  contractId = env.VITE_CONTRACT_ID || mockData.contractId,
}: {
  state: DemoState;
  total: number;
  walletAddress?: string;
  contractId?: string;
  onConnect: () => void;
  onPrimaryAction: () => void;
  onCreateAnother: () => void;
  onCopy: (message: string) => void;
}) {
  const confirmed = state.id === "success";
  const statusIcon =
    state.tone === "success" ? (
      <CheckCircle2 size={17} className="text-success" />
    ) : state.tone === "danger" || state.tone === "warning" ? (
      <AlertCircle size={17} className={state.tone === "danger" ? "text-danger" : "text-warning"} />
    ) : (
      <ShieldCheck size={17} className="text-info" />
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="relative w-full max-w-[520px] rounded-[24px] border border-border-subtle bg-surface p-5 shadow-card sm:p-7"
      aria-labelledby="checkin-title"
    >
      <div className="absolute -inset-px -z-10 rounded-[24px] bg-primary/10 blur-2xl" aria-hidden="true" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="checkin-title" className="font-display text-2xl font-semibold tracking-[-0.01em]">
            {copy.card.title}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">{copy.card.description}</p>
        </div>
        <Badge tone={state.networkOk ? "info" : "warning"}>{state.networkLabel}</Badge>
      </div>

      <CheckInCounter total={total} confirmed={confirmed} />

      <div className="space-y-4 border-y border-border-subtle py-5">
        <WalletIdentity
          connected={state.walletConnected}
          loading={state.walletLoading}
          address={walletAddress}
          onConnect={onConnect}
          onCopy={onCopy}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-text-muted">{copy.card.contract}</p>
            <code className="mt-1 block font-mono text-xs text-text-secondary">
              {shortContract(contractId)}
            </code>
          </div>
          <CopyButton value={contractId} label="Contract ID" onCopy={onCopy} />
        </div>
      </div>

      <div className="mt-5 space-y-4" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "rounded-2xl border p-4",
              state.tone === "success" && "border-success/35 bg-success/10",
              state.tone === "info" && "border-info/35 bg-info/10",
              state.tone === "warning" && "border-warning/35 bg-warning/10",
              state.tone === "danger" && "border-danger/35 bg-danger/10",
              state.tone === "neutral" && "border-border-subtle bg-surface-elevated/55",
            )}
          >
            <div className="flex items-start gap-3">
              {statusIcon}
              <div>
                <p className="font-semibold text-text-primary">{state.title}</p>
                <p className="mt-1 max-w-md text-sm leading-5 text-text-secondary">{state.description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {!confirmed ? <TransactionStepper steps={state.steps} /> : null}

        {!confirmed ? (
          <Button type="button" onClick={onPrimaryAction} disabled={state.primaryDisabled} className="w-full">
            {state.primaryLabel}
          </Button>
        ) : null}

        {confirmed && state.transactionHash ? (
          <TransactionResult
            hash={state.transactionHash}
            ledger={state.ledger}
            confirmedAt={state.confirmedAt}
            contractId={contractId}
            walletAddress={walletAddress}
            onCopy={onCopy}
            onCreateAnother={onCreateAnother}
          />
        ) : null}
        <EducationDisclosure visible={confirmed} />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <StatusIndicator tone={state.tone} label={state.action} />
        <NetworkStatus />
      </div>
    </motion.section>
  );
}
