import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginStatus: false,
    userid: '',
    displayname: '',
    email: '',
    preferredLanguages: [],
    previousRooms: [],
    idToken: ''
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
    }
  }
})

// Action creators are generated for each case reducer function
export const { setStateEmail, setUserid, setDisplayname, setLoginStatus, setPreferredLanguages, setIdToken, setPreviousRooms } = userSlice.actions

export const selectLoginstatus = (state) => state.user.loginStatus

export const selectUserid = (state) => state.user.userid

export const selectDisplayname = (state) => state.user.displayname

export const selectEmail = (state) => state.user.email

export const selectPreferredLanguages = (state) => state.user.preferredLanguages

export const selectIdToken = (state) => state.user.idToken

export const selectPreviousRooms = (state) => state.user.previousRooms

export default userSlice.reducer
