import { handleActions } from 'redux-actions'
import { SETIMGHTTP } from '../types/imgbase'

export default handleActions({
  [SETIMGHTTP] (state, action) {
    return {
      ...state,
      prehttp: action.payload
    }
  }
}, {
  prehttp: ''
})
