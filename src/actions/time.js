import { getSecondWithBaseAndBefore } from '../utils/time'

export const types = {
  clean: 'time_clean',
  pause: 'time_pause',
  stop: 'time_stop',
  start: 'time_start',
  reStart: 'time_reStart',
  undone: 'time_undone'
}

const INITIAL_STATE = {
  base: 0,
  lastStart: 0,
  total: 0
}

export const targetPause = pause => dispatch => {
  dispatch({
    type: pause ? types.start : types.pause
  })
}

export const clean = () => ({ type: types.clean })
export const pause = () => ({ type: types.pause })
export const start = () => ({ type: types.start })
export const stop = () => ({ type: types.stop })

export const reStart = () => dispatch => {
  dispatch({ type: types.reStart })
}

export const initUndoneTime = (base) => {
  return dispatch => {
    dispatch({ data: base, type: types.undone })
  }
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.clean: {
      return INITIAL_STATE
    }
    case types.reStart: {
      return {
        ...INITIAL_STATE,
        lastStart: Date.now()
      }
    }
    case types.pause: {
      return {
        ...state,
        lastStart: 0,
        base: getSecondWithBaseAndBefore(state.lastStart, state.base)
      }
    }
    case types.start: {
      return {
        ...state,
        lastStart: Date.now()
      }
    }
    case types.stop: {
      return {
        ...state,
        base: getSecondWithBaseAndBefore(state.lastStart, state.base),
        lastStart: 0,
        // total: state.running
        //   ? getSecondWithBaseAndBefore(state.lastStart, state.base)
        //   : state.base
        total: getSecondWithBaseAndBefore(state.lastStart, state.base)
      }
    }
    case types.undone: {
      return {
        ...INITIAL_STATE,
        base: action.data
      }
    }
    default:
      return state
  }
}
