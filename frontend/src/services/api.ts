import axios, { AxiosInstance } from 'axios'
import {
  Candidate,
  Job,
  Evaluation,
  EvaluationRequest,
  ApiError
} from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}${API_BASE_PATH}`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Candidates
  async getCandidates(skip: number = 0, limit: number = 20) {
    const response = await this.client.get<Candidate[]>('/candidates', {
      params: { skip, limit },
    })
    return response.data
  }

  async getCandidate(id: string) {
    const response = await this.client.get<Candidate>(`/candidates/${id}`)
    return response.data
  }

  async createCandidate(data: { id: string; profile: any }) {
    const response = await this.client.post<Candidate>('/candidates', data)
    return response.data
  }

  async updateCandidate(id: string, data: { id: string; profile: any }) {
    const response = await this.client.put<Candidate>(`/candidates/${id}`, data)
    return response.data
  }

  async deleteCandidate(id: string) {
    await this.client.delete(`/candidates/${id}`)
  }

  // Jobs
  async getJobs(skip: number = 0, limit: number = 20) {
    const response = await this.client.get<Job[]>('/jobs', {
      params: { skip, limit },
    })
    return response.data
  }

  async getJob(id: string) {
    const response = await this.client.get<Job>(`/jobs/${id}`)
    return response.data
  }

  async createJob(data: any) {
    const response = await this.client.post<Job>('/jobs', data)
    return response.data
  }

  async updateJob(id: string, data: any) {
    const response = await this.client.put<Job>(`/jobs/${id}`, data)
    return response.data
  }

  async deleteJob(id: string) {
    await this.client.delete(`/jobs/${id}`)
  }

  // Evaluations
  async runEvaluation(data: EvaluationRequest) {
    const response = await this.client.post<Evaluation>('/evaluations/run', data)
    return response.data
  }

  async getEvaluation(id: string) {
    const response = await this.client.get<Evaluation>(`/evaluations/${id}`)
    return response.data
  }

  async getEvaluations(candidateId?: string, jobId?: string, skip: number = 0, limit: number = 20) {
    const response = await this.client.get<Evaluation[]>('/evaluations', {
      params: { candidate_id: candidateId, job_id: jobId, skip, limit },
    })
    return response.data
  }

  async getCandidateEvaluationHistory(candidateId: string) {
    const response = await this.client.get<Evaluation[]>(
      `/evaluations/candidate/${candidateId}/history`
    )
    return response.data
  }

  async getJobEvaluationResults(jobId: string) {
    const response = await this.client.get<Evaluation[]>(
      `/evaluations/job/${jobId}/results`
    )
    return response.data
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health')
    return response.data
  }

  // Error handling helper
  handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { detail: error.message }
    }
    return { detail: 'An unexpected error occurred' }
  }
}

export const apiClient = new ApiClient()
