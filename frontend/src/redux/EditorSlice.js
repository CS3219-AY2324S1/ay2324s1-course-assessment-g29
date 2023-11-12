import { createSlice } from '@reduxjs/toolkit'

export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    code: 'Please choose a language to begin!\n',
    codeEditorLanguage: '',
    changeQuestionAlertOpen: false
  },
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload
    },
    setCodeEditorLanguage: (state, action) => {
      state.codeEditorLanguage = action.payload
    },
    setChangeQuestionAlertOpen: (state, action) => {
      state.changeQuestionAlertOpen = action.payload
    },
    setChangeQuestionData: (state, action) => {
      state.changeQuestionData = action.payload
    },
    resetEditorStore: (state, action) => {
      state.code = 'Please choose a language to begin!\n'
      state.codeEditorLanguage = ''
      state.changeQuestionAlertOpen = false
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setCode,
  setCodeEditorLanguage,
  setChangeQuestionAlertOpen,
  resetEditorStore
} =
  editorSlice.actions

export const selectCode = (state) => state.editor.code

export const selectCodeEditorLanguage = (state) => state.editor.codeEditorLanguage

export const selectChangeQuesitonAlertOpen = (state) => state.editor.changeQuestionAlertOpen

export default editorSlice.reducer
