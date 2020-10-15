import { combineReducers } from 'redux'

// SNEED INSERT IMPORT
import { userReducer } from 'userReducer'

export const rootReducer = combineReducers({
  // SNEED INSERT REDUCER
  user: userReducer,
})
