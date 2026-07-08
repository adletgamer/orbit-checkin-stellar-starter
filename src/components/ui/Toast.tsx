import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 left-1/2 z-50 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-strong bg-surface-elevated px-4 py-2 text-sm font-medium text-text-primary shadow-card"
          role="status"
        >
          <CheckCircle2 size={16} className="text-success" />
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
