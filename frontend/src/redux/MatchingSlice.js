import { createSlice } from '@reduxjs/toolkit'

export const matchingSlice = createSlice({
  name: 'match',
  initialState: {
    roomid: '',
    matchedUserid: '',
    questionData: {}
  },
  reducers: {
    setRoomId: (state, action) => {
      state.roomid = action.payload
    },
    setMatchedUserId: (state, action) => {
      state.matchedUserid = action.payload
    },
    setQuestionData: (state, action) => {
      state.questionData = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setRoomId, setMatchedUserId, setQuestionData } = matchingSlice.actions

export const selectRoomid = (state) => state.match.roomid

export const selectMatchedUserid = (state) => state.match.matchedUserid

export const selectQuestionData = (state) => state.match.questionData

export default matchingSlice.reducer
