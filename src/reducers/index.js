import { combineReducers } from 'redux'
import game from '../actions/game'
import time from '../actions/time'
import storageData from '../actions/storageData'

export default combineReducers({
  game,
  time,
  storageData
})
