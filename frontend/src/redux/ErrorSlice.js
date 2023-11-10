import { createSlice } from '@reduxjs/toolkit'

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    errorMessage: '',
    showError: false,
    successMessage: '',
    showSucess: false
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
      state.showSucess = action.payload
    }
  }
})


// Action creators are generated for each case reducer function
export const { setErrorMessage, setShowError, setSucessMessage, setShowSuccess } = errorSlice.actions

export const selectErrorMessage = (state) => state.error.errorMessage

export const selectShowError = (state) => state.error.showError

export const selectShowSuccess = (state) => state.error.showSucess

export const selectSuccessMessage = (state) => state.error.successMessage

export default errorSlice.reducer
