import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import matchReducer from './MatchingSlice'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
  key: 'root',
  storage: storageSession
}

const rootReducer = combineReducers({ 
  match: matchReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})
  
export const persistor = persistStore(store)
