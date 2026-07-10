export interface CandidateProfile {
  name: string
  email: string
  phone?: string
  location?: string
  total_years_experience: number
  languages: string[]
  education: string[]
  certifications: string[]
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  total_years_experience: number
  created_at?: string
  updated_at?: string
}

export interface JobDescription {
  id: string
  title: string
  company: string
  location?: string
  description: string
  responsibilities: string[]
  required_skills: string[]
  nice_to_have_skills: string[]
  years_experience_required: number
  seniority_level: string
  required_languages: string[]
  hiring_urgency: string
  team_context?: string
}

export interface Job {
  id: string
  title: string
  company: string
  location?: string
  years_experience_required: number
  seniority_level: string
  created_at?: string
  updated_at?: string
}

export interface Evaluation {
  id: string
  candidate_id: string
  job_id: string
  profile_score: number
  technical_score: number
  culture_score: number
  reference_score: number
  people_analytics_score?: number
  strategic_bonus: number
  final_score: number
  confidence: number
  language: string
  recommendation_status: 'GO' | 'HOLD' | 'NO_GO'
  rationale: string
  strengths: string[]
  gaps: string[]
  critical_flags: string[]
  next_steps: string[]
  onboarding_plan?: Record<string, unknown>
  playbook: string
  interview_notes?: string | null
  pre_interview_score?: number | null
  pre_interview_status?: 'GO' | 'HOLD' | 'NO_GO' | null
  notes_updated_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface EvaluationRequest {
  candidate_id: string
  job_id: string
  playbook: 'quick-screen' | 'full-evaluation' | 'full-people-analytics'
  use_people_analytics: boolean
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'recruiter'
}

export interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface ApiError {
  detail: string
  status_code?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}
