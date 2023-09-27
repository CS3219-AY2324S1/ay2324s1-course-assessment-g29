import { createSlice } from '@reduxjs/toolkit'

export const matchingSlice = createSlice({
  name: 'match',
  initialState: {
    roomid: '',
    userid: '',
  },
  reducers: {
    setRoomId: (state, action) => {
        state.roomid = action.payload;
    },
    setUserId: (state, action) => {
      state.userid = action.payload;
  },
  },
})

// Action creators are generated for each case reducer function
export const { setRoomId , setUserId} = matchingSlice.actions

export const selectRoomid = (state) => state.match.roomid;

export const selectUserid = (state) => state.match.userid;

export default matchingSlice.reducer