import { createSlice } from '@reduxjs/toolkit'

export const matchingSlice = createSlice({
  name: 'match',
  initialState: {
    isInitiator: 'awaiting',
    startVideoChat: false,
    twilioToken: null,
    awaitingMatching: false,
    difficulty: '',
    roomid: '',
    messages: [],
    matchedUserid: '',
    matchingLanguages: [],
    questionData: {}
  },
  reducers: {
    setIsInitiator: (state, action) => {
      state.isInitiator = action.payload
    },
    setStartVideoChat: (state, action) => {
      state.startVideoChat = action.payload
    },
    setTwilioToken: (state, action) => {
      state.twilioToken = action.payload
    },
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
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    appendMessages: (state, action) => {
      state.messages = [...state.messages, action.payload]
    }
  }
})

// Action creators are generated for each case reducer function
export const { setRoomId, setMatchedUserId, setQuestionData, setAwaitingMatching, setDifficulty, setMatchingLanguages, setMessages, appendMessages, setIsInitiator, setTwilioToken, setStartVideoChat } = matchingSlice.actions

export const selectStartVideoChat = (state) => state.match.startVideoChat

export const selectTwilioToken = (state) => state.match.twilioToken

export const selectIsInitiator = (state) => state.match.isInitiator

export const selectRoomid = (state) => state.match.roomid

export const selectDifficulty = (state) => state.match.difficulty

export const selectMatchedUserid = (state) => state.match.matchedUserid

export const selectQuestionData = (state) => state.match.questionData

export const selectAwaitingMatching = (state) => state.match.awaitingMatching

export const selectMatchingLanguages = (state) => state.match.matchingLanguages

export const selectMessages = (state) => state.match.messages

export default matchingSlice.reducer
