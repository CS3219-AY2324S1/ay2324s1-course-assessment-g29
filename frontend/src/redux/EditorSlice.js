import { createSlice } from '@reduxjs/toolkit'

export const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    code: 'Please choose a language to begin!\n',
    codeEditorLanguage: '',
    newProgrammingLanguage: '',
    awaitAlertOpen: false,
    awaitChangeQuestionOpen: false,
    changeQuestionAlertOpen: false,
    checkChangeQuestionData: false,
    changeQuestionData: {},
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
    setAwaitChangeQuestionOpen: (state, action) => {
      state.awaitChangeQuestionOpen = action.payload
    },
    setChangeQuestionAlertOpen: (state, action) => {
      state.changeQuestionAlertOpen = action.payload
    },
    setCheckChangeQuestionData: (state, action) => {
      state.checkChangeQuestionData = action.payload
    },
    setChangeQuestionData: (state, action) => {
      state.changeQuestionData = action.payload
    },
    setChangeProgrammingLanguageAlert: (state, action) => {
      state.changeProgrammingLanguageAlert = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setCode,
  setCodeEditorLanguage,
  setAwaitAlertOpen,
  setAwaitChangeQuestionOpen,
  setChangeQuestionAlertOpen,
  setChangeProgrammingLanguageAlert,
  setNewProgrammingLanguage,
  setCheckChangeQuestionData,
  setChangeQuestionData
} =
  editorSlice.actions

export const selectCode = (state) => state.editor.code

export const selectCodeEditorLanguage = (state) => state.editor.codeEditorLanguage

export const selectNewProgrammingLanguage = (state) => state.editor.newProgrammingLanguage

export const selectAwaitAlertOpen = (state) => state.editor.awaitAlertOpen

export const selectAwaitChangeQuestionOpen = (state) => state.editor.awaitChangeQuestionOpen

export const selectChangeQuesitonAlertOpen = (state) => state.editor.changeQuestionAlertOpen

export const selectCheckChangeQuestionData = (state) => state.editor.checkChangeQuestionData

export const selectChangeQuesitonData = (state) => state.editor.changeQuestionData

export const selectChangeProgrammingLanguageAlert = (state) => state.editor.changeProgrammingLanguageAlert

export default editorSlice.reducer
