import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Job } from '@/types'
import { apiClient } from '@/services/api'

export interface JobsState {
  items: Job[]
  selectedId: string | null
  isLoading: boolean
  error: string | null
  total: number
  skip: number
  limit: number
}

const initialState: JobsState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 20,
}

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ skip = 0, limit = 20 }: { skip?: number; limit?: number } = {}) => {
    return await apiClient.getJobs(skip, limit)
  }
)

export const fetchJob = createAsyncThunk('jobs/fetchJob', async (id: string) => {
  return await apiClient.getJob(id)
})

export const createJob = createAsyncThunk('jobs/createJob', async (data: any) => {
  return await apiClient.createJob(data)
})

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, data }: { id: string; data: any }) => {
    return await apiClient.updateJob(id, data)
  }
)

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id: string) => {
  await apiClient.deleteJob(id)
  return id
})

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    selectJob: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch jobs'
      })
      .addCase(createJob.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.push(action.payload)
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to create job'
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.items.findIndex((j) => j.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload)
      })
  },
})

export const { selectJob, clearError } = jobsSlice.actions
export default jobsSlice.reducer
