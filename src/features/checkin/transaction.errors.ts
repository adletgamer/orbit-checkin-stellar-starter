import { parseError } from "../../lib/errorParser";

export function parseTransactionError(error: unknown) {
  return parseError(error);
}
