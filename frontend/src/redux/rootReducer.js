import { combineReducers } from '@reduxjs/toolkit'
import matchReducer from './MatchingSlice.js'

const rootReducer = combineReducers({ match: matchReducer })

export default rootReducer
