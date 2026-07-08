import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, AuthState } from '@/types'

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setToken, setUser, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer
