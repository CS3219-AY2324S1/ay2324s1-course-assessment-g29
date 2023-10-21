import { createSlice } from '@reduxjs/toolkit'

export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    code: 'Please choose a language to begin!\n',
    codeEditorLanguage: '',
    newProgrammingLanguage: '',
    awaitAlertOpen: false,
    changeProgrammingLanguageAlert: false
  },
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload
    },
    setCodeEditorLanguage: (state, action) => {
      state.codeEditorLanguage = action.payload
    },
    setNewProgrammingLanguage: (state, action) => {
      state.newProgrammingLanguage = action.payload
    },
    setAwaitAlertOpen: (state, action) => {
      state.awaitAlertOpen = action.payload
    },
    setChangeProgrammingLanguageAlert: (state, action) => {
      state.changeProgrammingLanguageAlert = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCode, setCodeEditorLanguage, setAwaitAlertOpen, setChangeProgrammingLanguageAlert, setNewProgrammingLanguage } = editorSlice.actions

export const selectCode = (state) => state.editor.code

export const selectCodeEditorLanguage = (state) => state.editor.codeEditorLanguage

export const selectNewProgrammingLanguage = (state) => state.editor.newProgrammingLanguage

export const selectAwaitAlertOpen = (state) => state.editor.awaitAlertOpen

export const selectChangeProgrammingLanguageAlert = (state) => state.editor.changeProgrammingLanguageAlert

export default editorSlice.reducer
