import { motion } from "framer-motion";
import type { Candidate } from "@/lib/types";
import { initials, ratingDotColour } from "@/lib/utils";

interface Props {
  candidates: Candidate[];
  activeIndex: number;
  onSelect: (i: number) => void;
}

export function CandidateSidebar({ candidates, activeIndex, onSelect }: Props) {
  return (
    <aside className="card p-3 space-y-1 sticky top-20 self-start">
      <div className="px-2 py-2 text-xs uppercase tracking-wider text-ink-subtle font-semibold">
        Candidates ({candidates.length})
      </div>
      {candidates.map((c, i) => {
        const colour = ratingDotColour(c.fitment?.overall_rating);
        const active = i === activeIndex;
        return (
          <motion.button
            key={`${c.profile?.name ?? "x"}-${i}`}
            onClick={() => onSelect(i)}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition border ${
              active ? "bg-accent/15 border-accent/50" : "bg-transparent border-transparent hover:bg-surface-border/30"
            }`}
          >
            <div className="w-9 h-9 shrink-0 rounded-full grid place-items-center text-xs font-bold text-white"
                 style={{ background: `linear-gradient(135deg, ${colour}, ${colour}aa)` }}>
              {initials(c.profile?.name ?? "?")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate text-sm">{c.profile?.name ?? "Candidate"}</div>
              <div className="text-[11px] text-ink-subtle truncate">{c.profile?.headline ?? c.profile?.current_role ?? ""}</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colour }} title={c.fitment?.overall_rating} />
          </motion.button>
        );
      })}
    </aside>
  );
}
