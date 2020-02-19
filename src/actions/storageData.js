import { setGameStats } from '../utils/storage'

export const types = {
  updateGameStats: 'storage_updateGameStats'
}
const INITIAL_STATE = {
  gameStats: {}
}

export function updateGameStats(data) {
  return dispatch => {
    dispatch({ data, type: types.updateGameStats })
  }
}

export function storageGameOver() {
  return (dispatch, getState) => {
    const { result: { difficulty } } = getState().game
    const { base } = getState().time
    const { gameStats } = getState().storageData
    const gameData = gameStats[difficulty] || {}
    const { total = 0, totalTime = 0 } = gameData
    const newStats = {
      ...gameStats,
      [difficulty]: {
        ...gameData,
        total: total + 1,
        totalTime: totalTime + base,
        streak: 0,

      }
    }
    dispatch(updateGameStats(newStats))
    setGameStats(newStats)
  }
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.updateGameStats: {
      return {
        ...state,
        gameStats: action.data
      }
    }
    default:
      return state
  }
}
