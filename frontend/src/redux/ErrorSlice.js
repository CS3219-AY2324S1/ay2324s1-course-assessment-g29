import { createSlice } from '@reduxjs/toolkit'

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    errorMessage: '',
    showError: false,
    successMessage: '',
    showSuccess: false
  },
  reducers: {
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload
    },
    setShowError: (state, action) => {
      state.showError = action.payload
    },
    setSucessMessage: (state, action) => {
      state.successMessage = action.payload
    },
    setShowSuccess: (state, action) => {
      state.showSuccess = action.payload
    },
    resetErrorStore: (state, action) => {
      state.errorMessage = ''
      state.successMessage = ''
      state.showError = false
      state.showSuccess = false
    }
  }
})

// Action creators are generated for each case reducer function
export const { setErrorMessage, setShowError, setSucessMessage, setShowSuccess, resetErrorStore } = errorSlice.actions

export const selectErrorMessage = (state) => state.error.errorMessage

export const selectShowError = (state) => state.error.showError

export const selectShowSuccess = (state) => state.error.showSuccess

export const selectSuccessMessage = (state) => state.error.successMessage

export default errorSlice.reducer
