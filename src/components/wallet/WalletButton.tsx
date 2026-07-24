import { LogOut, Wallet } from "lucide-react";
import { Button } from "../ui/Button";

export function WalletButton({
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
  return (
    <Button
      type="button"
      variant={connected ? "subtle" : "secondary"}
      icon={connected ? <LogOut size={16} /> : <Wallet size={16} />}
      onClick={connected ? onDisconnect : onConnect}
      disabled={loading}
      className="min-w-[132px]"
    >
      {loading ? "Connecting" : connected ? "Disconnect" : "Connect wallet"}
    </Button>
  );
}
