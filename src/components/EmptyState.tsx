import { motion } from "framer-motion";
import { Wand2, Sparkles, FileSearch, Trophy } from "lucide-react";

interface Props { onTryDemo: () => void; ready: boolean }

const FEATURES = [
  { Icon: FileSearch, title: "Resume profiling", body: "Structured profile + must-have / nice-to-have matrix per candidate." },
  { Icon: Sparkles,   title: "Interview question bank", body: "10–14 tailored questions across four categories per candidate." },
  { Icon: Trophy,     title: "Slate comparison", body: "Shortlist + differentiators + recommended panel focus, all in one run." },
];

export function EmptyState({ onTryDemo, ready }: Props) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-accent/15 blur-3xl pointer-events-none animate-float" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none animate-float" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI Recruiting Co-pilot
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight max-w-2xl">
            Turn job descriptions, checklists, and resumes into <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-cyan-400">decision-ready panel packs.</span>
          </h1>
          <p className="mt-3 text-ink-muted max-w-2xl">
            TalentOps reads each candidate, rates them against your checklist with grounded justifications, writes the interview question bank,
            flags compliance items, and shortlists the slate — without producing a single numeric score.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onTryDemo} disabled={!ready} className="btn-primary">
              <Wand2 className="w-4 h-4" /> Try with sample data
            </button>
            <a href="#inputs" className="btn-outline">Upload my own</a>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="card p-5"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/15 grid place-items-center mb-3">
              <f.Icon className="w-4 h-4 text-accent" />
            </div>
            <div className="font-semibold">{f.title}</div>
            <div className="text-sm text-ink-muted mt-1">{f.body}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
