import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { InputPanel } from "@/components/InputPanel";
import { ProgressOverlay } from "@/components/ProgressOverlay";
import { SummaryStrip } from "@/components/SummaryStrip";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { CandidateDetail } from "@/components/CandidateDetail";
import { DownloadBar } from "@/components/DownloadBar";
import { EmptyState } from "@/components/EmptyState";
import { analyse, fetchSampleData } from "@/lib/api";
import type { AnalyseResponse } from "@/lib/types";

export default function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [checklistJson, setChecklistJson] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [useSamples, setUseSamples] = useState(true);
  const [result, setResult] = useState<AnalyseResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: sample } = useQuery({
    queryKey: ["sample-data"],
    queryFn: fetchSampleData,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!sample) return;
    if (!jobDescription) setJobDescription(sample.job_description);
    if (!checklistJson) setChecklistJson(JSON.stringify(sample.checklist, null, 2));
  }, [sample]); // eslint-disable-line react-hooks/exhaustive-deps

  const mutation = useMutation({
    mutationFn: analyse,
    onSuccess: (data) => {
      setResult(data);
      setActiveIndex(0);
      toast.success(`Analysed ${data.candidates.length} candidates${data.demo_mode ? " (demo mode)" : ""}.`);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    },
    onError: (err: Error) => toast.error(err.message || "Analysis failed"),
  });

  const onRun = () => mutation.mutate({
    jobDescription,
    checklistJson,
    files,
    useSamples,
  });

  const onReset = () => {
    setResult(null);
    setFiles([]);
    if (sample) {
      setJobDescription(sample.job_description);
      setChecklistJson(JSON.stringify(sample.checklist, null, 2));
      setUseSamples(true);
    } else {
      setJobDescription("");
      setChecklistJson("");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tryDemo = () => {
    if (!sample) return;
    setJobDescription(sample.job_description);
    setChecklistJson(JSON.stringify(sample.checklist, null, 2));
    setUseSamples(true);
    setFiles([]);
    setTimeout(() => onRun(), 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onReset={onReset} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {!result && <EmptyState onTryDemo={tryDemo} ready={!!sample} />}

        <div id="inputs">
          <InputPanel
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            checklistJson={checklistJson}
            setChecklistJson={setChecklistJson}
            files={files}
            setFiles={setFiles}
            useSamples={useSamples}
            setUseSamples={setUseSamples}
            sample={sample}
            onRun={onRun}
            isRunning={mutation.isPending}
            hasRun={!!result}
          />
        </div>

        {result && (
          <motion.div
            id="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <SummaryStrip summary={result.summary} />
            <ComparisonPanel comparison={result.comparison} />

            <div className="grid lg:grid-cols-[280px_1fr] gap-5">
              <CandidateSidebar
                candidates={result.candidates}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
              <CandidateDetail
                runId={result.run_id}
                candidate={result.candidates[activeIndex]}
                candidateIndex={activeIndex}
              />
            </div>
          </motion.div>
        )}
      </main>

      {result && <DownloadBar runId={result.run_id} />}
      <ProgressOverlay open={mutation.isPending} />

      <footer className="px-6 py-6 text-center text-xs text-ink-subtle">
        TalentOps · Ratings use only Meets / Partially Meets / Does Not Meet · No numeric scores produced.
      </footer>
    </div>
  );
}
