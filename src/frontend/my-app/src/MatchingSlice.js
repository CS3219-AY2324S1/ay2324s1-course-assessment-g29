import { createSlice } from '@reduxjs/toolkit'

export const matchingSlice = createSlice({
  name: 'match',
  initialState: {
    roomid: '',
  },
  reducers: {
    setRoomId: (state, action) => {
        state.roomid = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRoomId , setTimer} = matchingSlice.actions

export default matchingSlice.reducer