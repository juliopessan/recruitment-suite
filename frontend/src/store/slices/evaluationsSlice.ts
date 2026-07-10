import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { Evaluation, EvaluationRequest } from '@/types'
import { apiClient } from '@/services/api'

function apiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ detail?: string }>
  return axiosError.response?.data?.detail || fallback
}

export interface EvaluationsState {
  items: Evaluation[]
  currentEvaluation: Evaluation | null
  isLoading: boolean
  error: string | null
  total: number
  skip: number
  limit: number
}

const initialState: EvaluationsState = {
  items: [],
  currentEvaluation: null,
  isLoading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 20,
}

export const runEvaluation = createAsyncThunk(
  'evaluations/runEvaluation',
  async (data: EvaluationRequest) => {
    return await apiClient.runEvaluation(data)
  }
)

export const fetchEvaluation = createAsyncThunk(
  'evaluations/fetchEvaluation',
  async (id: string) => {
    return await apiClient.getEvaluation(id)
  }
)

export const addInterviewNotes = createAsyncThunk(
  'evaluations/addInterviewNotes',
  async ({ id, notes }: { id: string; notes: string }, { rejectWithValue }) => {
    try {
      return await apiClient.addInterviewNotes(id, notes)
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Failed to add interview notes'))
    }
  }
)

export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetchEvaluations',
  async ({ candidateId, jobId, skip = 0, limit = 20 }: {
    candidateId?: string
    jobId?: string
    skip?: number
    limit?: number
  }) => {
    return await apiClient.getEvaluations(candidateId, jobId, skip, limit)
  }
)

export const fetchCandidateHistory = createAsyncThunk(
  'evaluations/fetchCandidateHistory',
  async (candidateId: string) => {
    return await apiClient.getCandidateEvaluationHistory(candidateId)
  }
)

export const fetchJobResults = createAsyncThunk(
  'evaluations/fetchJobResults',
  async (jobId: string) => {
    return await apiClient.getJobEvaluationResults(jobId)
  }
)

const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentEvaluation: (state) => {
      state.currentEvaluation = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runEvaluation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(runEvaluation.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentEvaluation = action.payload
        state.items.unshift(action.payload)
      })
      .addCase(runEvaluation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to run evaluation'
      })
      .addCase(fetchEvaluation.fulfilled, (state, action) => {
        state.currentEvaluation = action.payload
      })
      .addCase(addInterviewNotes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addInterviewNotes.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentEvaluation = action.payload
      })
      .addCase(addInterviewNotes.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || action.error.message || 'Failed to add interview notes'
      })
      .addCase(fetchEvaluations.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch evaluations'
      })
      .addCase(fetchCandidateHistory.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(fetchJobResults.fulfilled, (state, action) => {
        state.items = action.payload
      })
  },
})

export const { clearError, clearCurrentEvaluation } = evaluationsSlice.actions
export default evaluationsSlice.reducer
