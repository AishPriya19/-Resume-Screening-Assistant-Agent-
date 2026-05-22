import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X, Wand2, FileCheck2, FileWarning, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Checklist, SampleDataResponse } from "@/lib/types";

interface InputPanelProps {
  jobDescription: string;
  setJobDescription: (v: string) => void;
  checklistJson: string;
  setChecklistJson: (v: string) => void;
  files: File[];
  setFiles: (f: File[]) => void;
  useSamples: boolean;
  setUseSamples: (v: boolean) => void;
  sample?: SampleDataResponse;
  onRun: () => void;
  isRunning: boolean;
  hasRun: boolean;
}

export function InputPanel(props: InputPanelProps) {
  const {
    jobDescription, setJobDescription,
    checklistJson, setChecklistJson,
    files, setFiles,
    useSamples, setUseSamples,
    sample, onRun, isRunning, hasRun,
  } = props;

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { if (hasRun) setCollapsed(true); }, [hasRun]);

  const checklistValid = useMemo(() => {
    try { JSON.parse(checklistJson); return true; } catch { return false; }
  }, [checklistJson]);

  const onDrop = (accepted: File[]) => {
    const allowed = accepted.filter((f) => /\.(pdf|txt)$/i.test(f.name));
    if (allowed.length !== accepted.length) toast.warning("Only .pdf and .txt are supported.");
    setFiles([...files, ...allowed]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
  });

  const removeFile = (i: number) => setFiles(files.filter((_, idx) => idx !== i));

  const tryDemo = () => {
    if (!sample) return;
    setJobDescription(sample.job_description);
    setChecklistJson(JSON.stringify(sample.checklist, null, 2));
    setUseSamples(true);
    setFiles([]);
    toast.success("Sample data loaded. Hit 'Analyse slate' to run.");
  };

  const canRun = checklistValid && jobDescription.trim().length > 0 && (files.length > 0 || useSamples);

  return (
    <motion.div layout className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-border/20 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/15 grid place-items-center">
            <Wand2 className="w-4 h-4 text-accent" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Inputs</div>
            <div className="text-xs text-ink-subtle">
              {hasRun ? (collapsed ? "Click to expand and edit" : "Click to collapse") : "Job description, checklist, and resumes"}
            </div>
          </div>
        </div>
        {sample && !hasRun && (
          <button onClick={(e) => { e.stopPropagation(); tryDemo(); }} className="btn-outline text-sm">
            <Wand2 className="w-3.5 h-3.5" /> Try with sample data
          </button>
        )}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid lg:grid-cols-3 gap-5 px-6 pb-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-ink-subtle font-semibold flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Job description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={14}
                  placeholder="Paste the full job description…"
                  className="w-full resize-none rounded-xl bg-surface border border-surface-border px-4 py-3 text-sm leading-relaxed focus:border-accent transition"
                />
                <div className="text-[11px] text-ink-subtle text-right">{jobDescription.length} chars</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-ink-subtle font-semibold flex items-center gap-2">
                  <FileCheck2 className="w-3.5 h-3.5" /> Evaluation checklist (JSON)
                </label>
                <textarea
                  value={checklistJson}
                  onChange={(e) => setChecklistJson(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  placeholder='{"role": "…", "must_haves": [...]}'
                  className={`w-full resize-none rounded-xl bg-surface border px-4 py-3 text-xs font-mono leading-relaxed transition ${
                    checklistValid ? "border-surface-border focus:border-accent" : "border-miss focus:border-miss"
                  }`}
                />
                <div className={`text-[11px] text-right ${checklistValid ? "text-ink-subtle" : "text-miss"}`}>
                  {checklistValid ? "Valid JSON" : "Invalid JSON"}
                </div>
                {sample && (
                  <ChecklistSummary checklist={parseSafely(checklistJson) ?? sample.checklist} />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-ink-subtle font-semibold flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Resumes
                </label>
                <div
                  {...getRootProps()}
                  className={`rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition ${
                    isDragActive ? "border-accent bg-accent/10" : "border-surface-border hover:border-accent/70 hover:bg-surface-border/20"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-6 h-6 mx-auto text-ink-muted mb-2" />
                  <div className="text-sm font-medium">Drag & drop PDF / TXT files</div>
                  <div className="text-xs text-ink-subtle mt-1">or click to browse</div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {files.map((f, i) => (
                      <motion.div
                        key={`${f.name}-${i}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between gap-2 rounded-lg bg-surface-raised px-3 py-2 text-sm border border-surface-border"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="truncate">{f.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="text-ink-subtle hover:text-miss"
                          title="Remove"
                          aria-label={`Remove ${f.name}`}
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <label className="mt-3 flex items-center gap-2 text-sm text-ink-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useSamples}
                    onChange={(e) => setUseSamples(e.target.checked)}
                    className="accent-accent w-4 h-4"
                  />
                  Use bundled samples if none uploaded
                </label>
              </div>
            </div>

            <div className="px-6 pb-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onRun}
                disabled={!canRun || isRunning}
                className="btn-primary w-full sm:w-auto sm:min-w-[260px] text-base"
              >
                {isRunning ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analysing slate…</>
                ) : (
                  <><Wand2 className="w-4 h-4" /> Analyse slate</>
                )}
              </button>
              {!canRun && !isRunning && (
                <div className="text-xs text-ink-subtle flex items-center gap-2">
                  <FileWarning className="w-3.5 h-3.5" />
                  Need a JD, valid checklist JSON, and at least one resume (or sample toggle on).
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function parseSafely(s: string): Checklist | null {
  try { return JSON.parse(s); } catch { return null; }
}

function ChecklistSummary({ checklist }: { checklist: Checklist }) {
  return (
    <div className="rounded-lg bg-surface-raised border border-surface-border px-3 py-2 text-xs text-ink-muted space-y-1">
      <div><span className="text-ink">Role:</span> {checklist.role}</div>
      <div>{checklist.must_haves?.length ?? 0} must-haves · {checklist.nice_to_haves?.length ?? 0} nice-to-haves · {checklist.compliance_required?.length ?? 0} compliance items</div>
    </div>
  );
}
