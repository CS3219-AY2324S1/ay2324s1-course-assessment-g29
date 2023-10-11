import { createSlice } from '@reduxjs/toolkit'

export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    code: 'Please choose a language to begin!\n'
  },
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCode } = editorSlice.actions

export const selectCode = (state) => state.editor.code

export default editorSlice.reducer
