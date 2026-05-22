import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  { key: "parse", label: "Parsing resumes" },
  { key: "profile", label: "Profiling candidates" },
  { key: "compare", label: "Comparing slate" },
  { key: "render", label: "Preparing artefacts" },
];

interface Props {
  open: boolean;
}

export function ProgressOverlay({ open }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) { setProgress(0); return; }
    setProgress(0);
    const id = setInterval(() => setProgress((p) => (p >= 3 ? 3 : p + 1)), 900);
    return () => clearInterval(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md grid place-items-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="card w-[min(420px,90vw)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <div className="font-display text-lg font-semibold">Running analysis…</div>
            </div>
            <ul className="space-y-3">
              {STEPS.map((s, i) => {
                const done = i < progress;
                const active = i === progress;
                return (
                  <li key={s.key} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full grid place-items-center text-xs font-bold transition ${
                      done ? "bg-meets text-white" : active ? "bg-accent/30 text-accent ring-2 ring-accent/60" : "bg-surface-border/60 text-ink-subtle"
                    }`}>
                      {done ? <Check className="w-3.5 h-3.5" /> : active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : i + 1}
                    </div>
                    <div className={`text-sm ${done ? "text-ink-muted line-through" : active ? "text-ink" : "text-ink-subtle"}`}>
                      {s.label}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 h-1.5 rounded-full bg-surface-border/40 overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-cyan-400 transition-all duration-500"
                   style={{ width: `${(progress / STEPS.length) * 100}%` }} />
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
