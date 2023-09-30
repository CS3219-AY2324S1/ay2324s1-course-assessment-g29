import { createSlice } from '@reduxjs/toolkit'

export const matchingSlice = createSlice({
  name: 'match',
  initialState: {
    roomid: '',
    userid: '',
    matchedUserid: ''
  },
  reducers: {
    setRoomId: (state, action) => {
      state.roomid = action.payload
    },
    setUserId: (state, action) => {
      state.userid = action.payload
    },
    setMatchedUserId: (state, action) => {
      state.matchedUserid = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setRoomId, setUserId, setMatchedUserId } = matchingSlice.actions

export const selectRoomid = (state) => state.match.roomid

export const selectUserid = (state) => state.match.userid

export const selectMatchedUserid = (state) => state.match.matchedUserid

export default matchingSlice.reducer
