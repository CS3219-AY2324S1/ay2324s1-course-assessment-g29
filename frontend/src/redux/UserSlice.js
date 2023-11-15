import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginStatus: false,
    isAuthorized: null,
    userid: '',
    displayname: '',
    email: '',
    preferredLanguages: [],
    previousRooms: [],
    previousQuestions: [],
    idToken: '',
    changeDeactivateAccountAlert: false
  },
  reducers: {
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload
    },
    setUserid: (state, action) => {
      state.userid = action.payload
    },
    setDisplayname: (state, action) => {
      state.displayname = action.payload
    },
    setStateEmail: (state, action) => {
      state.email = action.payload
    },
    setPreferredLanguages: (state, action) => {
      state.preferredLanguages = action.payload
    },
    setIdToken: (state, action) => {
      state.idToken = action.payload
    },
    setPreviousRooms: (state, action) => {
      state.previousRooms = action.payload
    },
    setChangeDeactivateAccountAlert: (state, action) => {
      state.changeDeactivateAccountAlert = action.payload
    },
    setPreviousQuestions: (state, action) => {
      state.previousQuestions = action.payload
    },
    setIsAuthorized: (state, action) => {
      state.isAuthorized = action.payload
    },
    resetUserStore: (state, action) => {
      state.loginStatus = false
      state.isAuthorized = null
      state.userid = ''
      state.displayname = ''
      state.email = ''
      state.preferredLanguages = []
      state.previousRooms = []
      state.previousQuestions = []
      state.idToken = ''
      state.changeDeactivateAccountAlert = false
    }
  }
})

// Action creators are generated for each case reducer function

export const { resetUserStore, setStateEmail, setUserid, setDisplayname, setLoginStatus, setPreferredLanguages, setIdToken, setChangeDeactivateAccountAlert, setPreviousRooms, setPreviousQuestions, setIsAuthorized } = userSlice.actions

export const selectLoginstatus = (state) => state.user.loginStatus

export const selectUserid = (state) => state.user.userid

export const selectDisplayname = (state) => state.user.displayname

export const selectEmail = (state) => state.user.email

export const selectPreferredLanguages = (state) => state.user.preferredLanguages

export const selectIdToken = (state) => state.user.idToken

export const selectPreviousRooms = (state) => state.user.previousRooms

export const selectChangeDeactivateAccountAlert = (state) => state.user.changeDeactivateAccountAlert

export const selectPreviousQuestions = (state) => state.user.previousQuestions

export const selectIsAuthorized = (state) => state.user.isAuthorized

export default userSlice.reducer
