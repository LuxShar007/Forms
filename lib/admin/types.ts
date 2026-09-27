// lib/admin/types.ts
// Interfaces for the Cubet Music Study admin response dashboard

export interface AdminResponseItem {
  id: string;
  name: string;
  email: string;
  age_range: string;
  submitted_at: string;
  completion_time_seconds: number | null;
  future_research_opt_in: boolean;
  survey_version: string;
  answers: Record<string, { selected?: string | string[]; text?: string }>;
}

export interface AdminStats {
  total: number;
  completed: number;
  today: number;
  avgCompletionSeconds: number | null;
  futureOptIns: number;
}

export interface FilterState {
  search: string;
  age: string;
  platform: string;
  optInOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'duration_desc' | 'duration_asc';
}
