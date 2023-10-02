import { combineReducers } from '@reduxjs/toolkit'
import matchReducer from './MatchingSlice.js'
import userReducer from './UserSlice.js'

const rootReducer = combineReducers({ match: matchReducer, user: userReducer })

export default rootReducer
