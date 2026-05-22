import { Moon, Sun, RefreshCw, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/api";
import { motion } from "framer-motion";

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const { data: health } = useQuery({ queryKey: ["health"], queryFn: fetchHealth, staleTime: 60_000, refetchInterval: 60_000 });

  const status = !health
    ? { dot: "bg-amber-400 animate-pulse", text: "Checking backend…" }
    : health.demo_mode
    ? { dot: "bg-amber-400", text: "Demo Mode" }
    : { dot: "bg-emerald-400", text: `Live · ${health.model}` };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-surface/60 border-b border-surface-border/60">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-none">TalentOps</div>
            <div className="text-[11px] text-ink-subtle leading-none mt-0.5">AI Recruiting Co-pilot</div>
          </div>
        </motion.div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised/70 border border-surface-border/70 text-xs">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className="text-ink-muted">{status.text}</span>
        </div>

        <button onClick={onReset} className="btn-ghost text-sm" title="Reset" aria-label="Reset analysis">
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> Reset
        </button>

        <button
          onClick={toggle}
          className="btn-ghost p-2"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
