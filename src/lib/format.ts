export function shortenAddress(value: string, head = 4, tail = 4) {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function formatTotal(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
