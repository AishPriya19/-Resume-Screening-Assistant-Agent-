import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Award, Sparkle, TrendingDown, Download, Check, ChevronDown, Copy, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Candidate, CriterionRow, QuestionItem } from "@/lib/types";
import { cn, ratingClass } from "@/lib/utils";
import { feedbackUrl } from "@/lib/api";

interface Props {
  runId: string;
  candidate: Candidate;
  candidateIndex: number;
}

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "fitment", label: "Fitment" },
  { key: "questions", label: "Questions" },
  { key: "compliance", label: "Compliance" },
] as const;

type TabKey = typeof TABS[number]["key"];

export function CandidateDetail({ runId, candidate, candidateIndex }: Props) {
  const [tab, setTab] = useState<TabKey>("overview");
  const profile = candidate.profile ?? { name: "Candidate" };
  const fitment = candidate.fitment;
  const overall = fitment?.overall_rating ?? "Does Not Meet";

  return (
    <motion.section
      key={candidateIndex}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{profile.name}</h1>
              <span className={cn("badge text-sm", ratingClass(overall))}>{overall}</span>
            </div>
            <p className="text-ink-muted mt-1">{profile.headline}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-subtle">
              {profile.current_role && <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{profile.current_role}</span>}
              {profile.years_experience ? <span>{profile.years_experience} yrs experience</span> : null}
              {profile.education?.[0] && <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{profile.education[0]}</span>}
            </div>
          </div>
          <a href={feedbackUrl(runId, candidateIndex)} target="_blank" rel="noreferrer" className="btn-outline text-sm">
            <Download className="w-3.5 h-3.5" /> Word feedback pack
          </a>
        </div>

        {fitment?.overall_summary && (
          <p className="mt-4 text-sm text-ink-muted leading-relaxed italic border-l-2 border-accent/50 pl-3">
            {fitment.overall_summary}
          </p>
        )}

        <div className="mt-5 flex gap-1 border-b border-surface-border">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition relative",
                tab === t.key ? "text-ink" : "text-ink-subtle hover:text-ink"
              )}>
              {t.label}
              {tab === t.key && (
                <motion.div layoutId="active-tab" className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "overview" && <OverviewTab candidate={candidate} />}
              {tab === "fitment" && <FitmentTab candidate={candidate} />}
              {tab === "questions" && <QuestionsTab candidate={candidate} />}
              {tab === "compliance" && <ComplianceTab candidate={candidate} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function OverviewTab({ candidate }: { candidate: Candidate }) {
  const { profile, fitment } = candidate;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Block icon={<Sparkle className="w-3.5 h-3.5" />} title="Strengths" tone="meets">
        <ChipList items={profile?.strengths ?? []} tone="meets" empty="None listed." />
      </Block>
      <Block icon={<TrendingDown className="w-3.5 h-3.5" />} title="Gaps" tone="miss">
        <ChipList items={profile?.gaps ?? []} tone="miss" empty="None listed." />
      </Block>
      <Block icon={<Award className="w-3.5 h-3.5" />} title="Skills" tone="neutral">
        <ChipList items={profile?.skills ?? []} tone="neutral" empty="No skill list extracted." />
      </Block>
      <Block icon={<AlertTriangle className="w-3.5 h-3.5" />} title="Red flags" tone="partial">
        <ChipList items={fitment?.red_flags_observed ?? []} tone="partial" empty="None observed." />
      </Block>
    </div>
  );
}

function FitmentTab({ candidate }: { candidate: Candidate }) {
  const f = candidate.fitment;
  return (
    <div className="space-y-5">
      <CriterionTable title="Must-haves" rows={f?.must_haves ?? []} />
      <CriterionTable title="Nice-to-haves" rows={f?.nice_to_haves ?? []} />
    </div>
  );
}

function CriterionTable({ title, rows }: { title: string; rows: CriterionRow[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-ink-subtle font-semibold mb-2">{title}</div>
      <div className="space-y-1.5">
        {rows.length === 0 && <div className="text-sm text-ink-subtle">None listed.</div>}
        {rows.map((r, i) => (
          <div key={i} className="rounded-xl border border-surface-border bg-surface overflow-hidden">
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-border/30 transition text-left">
              <span className={cn("badge", ratingClass(r.rating))}>{r.rating}</span>
              <div className="flex-1 text-sm">{r.criterion}</div>
              <ChevronDown className={cn("w-4 h-4 transition", openIdx === i && "rotate-180")} />
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 pt-1 text-sm text-ink-muted leading-relaxed border-t border-surface-border/60">
                    {r.justification || "No justification provided."}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionsTab({ candidate }: { candidate: Candidate }) {
  const byCat = candidate.questions?.by_category ?? {};
  const categories = Object.keys(byCat).filter((c) => (byCat[c] ?? []).length > 0);
  if (categories.length === 0) return <div className="text-sm text-ink-subtle">No questions returned.</div>;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat} category={cat} items={byCat[cat] ?? []} />
      ))}
    </div>
  );
}

function CategoryCard({ category, items }: { category: string; items: QuestionItem[] }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-4">
      <div className="text-xs uppercase tracking-wider text-accent font-semibold mb-3">{category}</div>
      <ol className="space-y-3">
        {items.map((q, i) => (
          <li key={i} className="text-sm">
            <div className="flex items-start gap-2">
              <span className="text-ink-subtle font-mono shrink-0 text-xs pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <div className="text-ink leading-relaxed">{q.question}</div>
                {q.why && <div className="text-xs text-ink-subtle mt-1 italic">Why: {q.why}</div>}
                {q.auto_filled && (
                  <div className="text-[11px] text-partial mt-1">Auto-filled placeholder — replace before interview.</div>
                )}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(q.question); toast.success("Question copied"); }}
                className="text-ink-subtle hover:text-accent shrink-0 mt-0.5"
                title="Copy question"
                aria-label="Copy question to clipboard"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ComplianceTab({ candidate }: { candidate: Candidate }) {
  const comp = candidate.compliance;
  if (!comp || !comp.gaps?.length) return <div className="text-sm text-ink-subtle">No compliance items specified.</div>;
  return (
    <div className="space-y-2">
      {comp.gaps.map((g) => {
        const referenced = g.status === "Referenced";
        return (
          <div key={g.item} className="rounded-xl border border-surface-border bg-surface px-4 py-3 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg grid place-items-center", referenced ? "bg-meets/15 text-meets" : "bg-partial/15 text-partial")}>
              {referenced ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{g.item.replace(/_/g, " ")}</div>
              <div className="text-xs text-ink-subtle">{g.action}</div>
            </div>
            <span className={cn("badge", referenced ? "badge-meets" : "badge-partial")}>{g.status}</span>
          </div>
        );
      })}
    </div>
  );
}

function Block({ icon, title, tone, children }: { icon: React.ReactNode; title: string; tone: "meets" | "miss" | "partial" | "neutral"; children: React.ReactNode }) {
  const colour = tone === "meets" ? "text-meets" : tone === "miss" ? "text-miss" : tone === "partial" ? "text-partial" : "text-accent";
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-4">
      <div className={cn("text-xs uppercase tracking-wider font-semibold mb-2 flex items-center gap-2", colour)}>
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function ChipList({ items, tone, empty }: { items: string[]; tone: "meets" | "miss" | "partial" | "neutral"; empty: string }) {
  if (!items.length) return <div className="text-sm text-ink-subtle">{empty}</div>;
  const cls =
    tone === "meets" ? "bg-meets/10 border-meets/40 text-meets" :
    tone === "miss" ? "bg-miss/10 border-miss/40 text-miss" :
    tone === "partial" ? "bg-partial/10 border-partial/40 text-partial" :
    "bg-surface-border/30 border-surface-border text-ink-muted";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s, i) => (
        <span key={i} className={cn("px-2.5 py-1 rounded-full border text-xs", cls)}>{s}</span>
      ))}
    </div>
  );
}
