import { motion } from "framer-motion";
import { Users, CheckCircle2, AlertCircle, XCircle, type LucideIcon } from "lucide-react";
import type { AnalyseSummary } from "@/lib/types";

interface SummaryTile {
  key: keyof AnalyseSummary;
  label: string;
  colour: string;
  Icon: LucideIcon;
}

const TILES: SummaryTile[] = [
  { key: "total", label: "Total candidates", colour: "from-violet-500 to-cyan-400", Icon: Users },
  { key: "meets", label: "Meets", colour: "from-emerald-400 to-emerald-600", Icon: CheckCircle2 },
  { key: "partial", label: "Partially Meets", colour: "from-amber-400 to-amber-600", Icon: AlertCircle },
  { key: "miss", label: "Does Not Meet", colour: "from-rose-400 to-rose-600", Icon: XCircle },
];

export function SummaryStrip({ summary }: { summary: AnalyseSummary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {TILES.map((t, i) => (
        <motion.div
          key={t.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card p-4 relative overflow-hidden"
        >
          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${t.colour}`} />
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-subtle font-semibold">
            <t.Icon className="w-3.5 h-3.5" /> {t.label}
          </div>
          <div className="mt-2 font-display text-3xl font-bold">{summary[t.key]}</div>
        </motion.div>
      ))}
    </div>
  );
}
