import { createSlice } from '@reduxjs/toolkit'

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    errorMessage: '',
    showError: false
  },
  reducers: {
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload
    },
    setShowError: (state, action) => {
      state.showError = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setErrorMessage, setShowError } = errorSlice.actions

export const selectErrorMessage = (state) => state.error.errorMessage

export const selectShowError = (state) => state.error.showError

export default errorSlice.reducer
