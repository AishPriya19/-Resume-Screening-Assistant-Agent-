import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { dashboardUrl, matrixUrl } from "@/lib/api";

interface Props { runId: string }

export function DownloadBar({ runId }: Props) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-5 right-5 z-40 card p-2 flex gap-2 shadow-glow"
    >
      <a href={dashboardUrl(runId)} target="_blank" rel="noreferrer" className="btn-ghost text-sm" title="Download HTML dashboard">
        <FileText className="w-4 h-4 text-accent" />
        <span className="hidden sm:inline">HTML dashboard</span>
      </a>
      <a href={matrixUrl(runId)} target="_blank" rel="noreferrer" className="btn-ghost text-sm" title="Download Excel matrix">
        <FileSpreadsheet className="w-4 h-4 text-meets" />
        <span className="hidden sm:inline">Excel matrix</span>
      </a>
    </motion.div>
  );
}
