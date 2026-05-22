export type Rating = "Meets" | "Partially Meets" | "Does Not Meet";

export interface CriterionRow {
  criterion: string;
  rating: Rating | string;
  justification: string;
}

export interface CandidateProfile {
  name: string;
  headline?: string;
  years_experience?: number;
  current_role?: string;
  skills?: string[];
  education?: string[];
  certifications?: string[];
  strengths?: string[];
  gaps?: string[];
  tenure_flags?: string[];
}

export interface CandidateFitment {
  overall_rating: Rating | string;
  overall_summary: string;
  must_haves: CriterionRow[];
  nice_to_haves: CriterionRow[];
  red_flags_observed?: string[];
}

export interface QuestionItem {
  category: string;
  question: string;
  why?: string;
  auto_filled?: boolean;
}

export interface QuestionBank {
  questions: QuestionItem[];
  by_category?: Record<string, QuestionItem[]>;
}

export interface ComplianceItem {
  item: string;
  status: string;
  action: string;
}

export interface ComplianceBlock {
  required: string[];
  gaps: ComplianceItem[];
}

export interface Candidate {
  profile: CandidateProfile;
  fitment: CandidateFitment;
  questions: QuestionBank;
  compliance?: ComplianceBlock;
}

export interface ComparisonDifferentiator {
  candidate: string;
  edge: string;
  watch_out: string;
}

export interface Comparison {
  summary: string;
  shortlist: string[];
  differentiators?: ComparisonDifferentiator[];
  recommended_panel_focus?: string;
}

export interface AnalyseSummary {
  total: number;
  meets: number;
  partial: number;
  miss: number;
}

export interface AnalyseResponse {
  run_id: string;
  demo_mode: boolean;
  candidates: Candidate[];
  comparison: Comparison;
  summary: AnalyseSummary;
}

export interface HealthResponse {
  status: "ok";
  demo_mode: boolean;
  model: string;
}

export interface ChecklistMustHave {
  criterion: string;
  weight?: string;
}

export interface Checklist {
  role: string;
  must_haves: ChecklistMustHave[];
  nice_to_haves: ChecklistMustHave[];
  red_flags: string[];
  compliance_required: string[];
}

export interface SampleDataResponse {
  checklist: Checklist;
  job_description: string;
  sample_resumes: string[];
}
