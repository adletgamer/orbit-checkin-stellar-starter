import { parseError } from "../../lib/errorParser";

export function parseWalletError(error: unknown) {
  const friendly = parseError(error);

  if (friendly.code === "signature_rejected") {
    return {
      ...friendly,
      title: "Connection cancelled",
      message: "Your wallet remains disconnected. Try again when you are ready.",
    };
  }

  return friendly;
}
