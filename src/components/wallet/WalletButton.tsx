import { Wallet } from "lucide-react";
import { shortenAddress } from "../../lib/format";
import { Button } from "../ui/Button";

export function WalletButton({
  connected,
  loading,
  address,
  onConnect,
}: {
  connected: boolean;
  loading?: boolean;
  address?: string;
  onConnect: () => void;
}) {
  const shortAddress = address ? shortenAddress(address) : "Connected";

  return (
    <Button
      type="button"
      variant={connected ? "subtle" : "secondary"}
      icon={<Wallet size={16} />}
      onClick={onConnect}
      disabled={loading}
      className="min-w-[132px]"
    >
      {loading ? "Connecting" : connected ? shortAddress : "Connect"}
    </Button>
  );
}
