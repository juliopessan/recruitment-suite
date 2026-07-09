import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Candidate } from '@/types'
import { apiClient } from '@/services/api'

interface CandidatesState {
  items: Candidate[]
  selectedId: string | null
  isLoading: boolean
  error: string | null
  total: number
  skip: number
  limit: number
}

const initialState: CandidatesState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 20,
}

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async ({ skip = 0, limit = 20 }: { skip?: number; limit?: number }) => {
    return await apiClient.getCandidates(skip, limit)
  }
)

export const fetchCandidate = createAsyncThunk(
  'candidates/fetchCandidate',
  async (id: string) => {
    return await apiClient.getCandidate(id)
  }
)

export const createCandidate = createAsyncThunk(
  'candidates/createCandidate',
  async (data: { id: string; profile: any }) => {
    return await apiClient.createCandidate(data)
  }
)

export const updateCandidate = createAsyncThunk(
  'candidates/updateCandidate',
  async ({ id, data }: { id: string; data: { id: string; profile: any } }) => {
    return await apiClient.updateCandidate(id, data)
  }
)

export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id: string) => {
    await apiClient.deleteCandidate(id)
    return id
  }
)

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    selectCandidate: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch candidates'
      })
      .addCase(createCandidate.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.push(action.payload)
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to create candidate'
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload)
      })
  },
})

export const { selectCandidate, clearError } = candidatesSlice.actions
export default candidatesSlice.reducer
