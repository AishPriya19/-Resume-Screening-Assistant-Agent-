import { motion } from "framer-motion";
import { Trophy, Target, Lightbulb } from "lucide-react";
import type { Comparison } from "@/lib/types";

export function ComparisonPanel({ comparison }: { comparison: Comparison }) {
  if (!comparison) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-accent/15 grid place-items-center"><Trophy className="w-4 h-4 text-accent" /></div>
        <h2 className="font-display text-xl font-semibold">Panel recommendation</h2>
      </div>
      <p className="text-ink-muted leading-relaxed">{comparison.summary}</p>

      {comparison.shortlist?.length > 0 && (
        <>
          <div className="text-xs uppercase tracking-wider text-ink-subtle font-semibold mt-5 mb-2 flex items-center gap-2">
            <Target className="w-3.5 h-3.5" /> Shortlist
          </div>
          <div className="flex flex-wrap gap-2">
            {comparison.shortlist.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-cyan-400/15 border border-accent/40 text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </>
      )}

      {comparison.differentiators?.length ? (
        <>
          <div className="text-xs uppercase tracking-wider text-ink-subtle font-semibold mt-5 mb-2">Differentiators</div>
          <div className="grid md:grid-cols-2 gap-3">
            {comparison.differentiators.map((d) => (
              <div key={d.candidate} className="rounded-xl bg-surface border border-surface-border p-4">
                <div className="font-semibold mb-1">{d.candidate}</div>
                <div className="text-xs text-ink-subtle uppercase tracking-wider mb-1">Edge</div>
                <div className="text-sm text-ink mb-2">{d.edge}</div>
                <div className="text-xs text-ink-subtle uppercase tracking-wider mb-1">Watch out</div>
                <div className="text-sm text-ink-muted">{d.watch_out}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {comparison.recommended_panel_focus && (
        <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-accent/8 border border-accent/30">
          <Lightbulb className="w-4 h-4 mt-0.5 text-accent shrink-0" />
          <div>
            <div className="text-xs uppercase tracking-wider text-accent font-semibold mb-1">Recommended panel focus</div>
            <div className="text-sm text-ink">{comparison.recommended_panel_focus}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
