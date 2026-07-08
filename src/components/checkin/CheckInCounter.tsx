import { motion } from "framer-motion";
import { copy } from "../../content/copy";
import { formatTotal } from "../../lib/format";

export function CheckInCounter({ total, confirmed }: { total: number; confirmed: boolean }) {
  return (
    <motion.div
      animate={confirmed ? { scale: [1, 1.025, 1] } : { scale: 1 }}
      transition={{ duration: 0.42 }}
      className="py-6"
    >
      <p className="text-sm text-text-secondary">{copy.card.total}</p>
      <motion.p
        key={total}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mt-1 font-display text-6xl font-semibold tracking-[-0.03em] text-text-primary"
      >
        {formatTotal(total)}
      </motion.p>
      <p className="mt-1 text-sm text-text-muted">{copy.card.recorded}</p>
    </motion.div>
  );
}
