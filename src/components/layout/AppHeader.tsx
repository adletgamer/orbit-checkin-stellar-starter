import { BookOpen, Github, Menu, X } from "lucide-react";
import { useState } from "react";
import { copy } from "../../content/copy";
import { mockData } from "../../features/demo/demoStates";
import { Badge } from "../ui/Badge";
import { WalletButton } from "../wallet/WalletButton";

export function OrbitMark() {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/35 bg-primary/10">
      <span className="absolute h-6 w-6 rounded-full border border-cyan/55" />
      <span className="h-2.5 w-2.5 rounded-full orbital-gradient" />
    </span>
  );
}

export function AppHeader({
  connected,
  loading,
  address,
  onConnect,
  onDisconnect,
}: {
  connected: boolean;
  loading?: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle/70 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <OrbitMark />
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold tracking-[-0.01em] text-text-primary">
              {copy.appName}
            </p>
            <p className="hidden text-xs text-text-muted sm:block">Built on Stellar</p>
          </div>
          <Badge tone="info">Testnet</Badge>
        </div>

        <nav className="flex items-center gap-2" aria-label="Primary navigation">
          <a
            href="#tutorial"
            className="hidden min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-soft hover:text-text-primary md:inline-flex"
          >
            <BookOpen size={16} />
            {copy.nav.tutorial}
          </a>
          <a
            href={mockData.sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-soft hover:text-text-primary"
          >
            <Github size={17} />
            <span className="hidden lg:inline">{copy.nav.github}</span>
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary transition hover:bg-surface-soft hover:text-text-primary md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <WalletButton connected={connected} loading={loading} address={address} onConnect={onConnect} onDisconnect={onDisconnect} />
        </nav>
      </div>
      {menuOpen ? (
        <nav className="border-t border-border-subtle bg-surface px-5 py-3 md:hidden" aria-label="Mobile navigation">
          <a href="#tutorial" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary hover:bg-surface-soft hover:text-text-primary">
            <BookOpen size={16} /> {copy.nav.tutorial}
          </a>
          <a href={mockData.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary hover:bg-surface-soft hover:text-text-primary">
            <Github size={16} /> {copy.nav.github}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
