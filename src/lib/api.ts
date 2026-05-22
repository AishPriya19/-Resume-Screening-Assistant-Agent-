import type { AnalyseResponse, HealthResponse, SampleDataResponse } from "./types";

export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://127.0.0.1:8000";

export async function fetchHealth(): Promise<HealthResponse> {
  const r = await fetch(`${API_BASE}/api/health`);
  if (!r.ok) throw new Error(`Health check failed (${r.status})`);
  return r.json();
}

export async function fetchSampleData(): Promise<SampleDataResponse> {
  const r = await fetch(`${API_BASE}/api/sample-data`);
  if (!r.ok) throw new Error(`Could not load sample data (${r.status})`);
  return r.json();
}

export interface AnalyseInput {
  jobDescription: string;
  checklistJson: string;
  files: File[];
  useSamples: boolean;
}

export async function analyse(input: AnalyseInput): Promise<AnalyseResponse> {
  const fd = new FormData();
  fd.append("job_description", input.jobDescription);
  fd.append("checklist", input.checklistJson);
  fd.append("use_samples", input.useSamples ? "true" : "false");
  for (const f of input.files) fd.append("files", f);

  const r = await fetch(`${API_BASE}/api/analyse`, { method: "POST", body: fd });
  if (!r.ok) {
    let detail = `Request failed (${r.status})`;
    try {
      const body = await r.json();
      if (body?.detail) detail = body.detail;
    } catch {}
    throw new Error(detail);
  }
  return r.json();
}

export function dashboardUrl(runId: string): string {
  return `${API_BASE}/api/runs/${runId}/dashboard.html`;
}
export function matrixUrl(runId: string): string {
  return `${API_BASE}/api/runs/${runId}/matrix.xlsx`;
}
export function feedbackUrl(runId: string, candidateIndex: number): string {
  return `${API_BASE}/api/runs/${runId}/feedback/${candidateIndex}.docx`;
}
