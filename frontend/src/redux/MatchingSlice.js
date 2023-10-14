import { createSlice } from '@reduxjs/toolkit'

export const matchingSlice = createSlice({
  name: 'match',
  initialState: {
    awaitingMatching: false,
    difficulty: '',
    roomid: '',
    matchedUserid: '',
    matchingLanguages: [],
    questionData: {}
  },
  reducers: {
    setAwaitingMatching: (state, action) => {
      state.awaitingMatching = action.payload
    },
    setRoomId: (state, action) => {
      state.roomid = action.payload
    },
    setMatchedUserId: (state, action) => {
      state.matchedUserid = action.payload
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload
    },
    setMatchingLanguages: (state, action) => {
      state.matchingLanguages = action.payload
    },
    setQuestionData: (state, action) => {
      state.questionData = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setRoomId, setMatchedUserId, setQuestionData, setAwaitingMatching, setDifficulty, setMatchingLanguages, setCodeEditorLanguage } = matchingSlice.actions

export const selectRoomid = (state) => state.match.roomid

export const selectDifficulty = (state) => state.match.difficulty

export const selectMatchedUserid = (state) => state.match.matchedUserid

export const selectQuestionData = (state) => state.match.questionData

export const selectAwaitingMatching = (state) => state.match.awaitingMatching

export const selectMatchingLanguages = (state) => state.match.matchingLanguages

export default matchingSlice.reducer
