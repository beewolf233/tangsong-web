import { combineReducers } from 'redux'
import counter from './counter'
import imgbase from './imgbase'
export default combineReducers({
  counter,
  imgbase
})
