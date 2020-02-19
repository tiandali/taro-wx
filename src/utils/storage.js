import Taro from '@tarojs/taro'
import {
  BASE_COUNT_OF_GAME,
  finishedGame,
  countOfGameInDb,
  indexOfGameInDb,
  dbSourceInfo,
  storageDbName,
  gameStats,
  undoneGame,
  offSound
} from '../constants/storage'

/**
 * DataBase
 * */

export const getDBSource = () =>
  Taro.getStorage({ key: dbSourceInfo })
    .then(r => r.data)
    .catch(err => {
      console.error('getDBSource err:', err)
      return []
    })

export const addToDBSource = async newKey => {
  const data = await getDBSource()
  if (!data.includes(newKey)) {
    return Taro.setStorage({
      key: dbSourceInfo,
      data: [...data, newKey]
    }).catch(console.error)
  }
}

// 当前本地数据库对应服务端数据库的index
export const setCountOfGameInDb = (s, d, count) => {
  return Taro.setStorage({ key: countOfGameInDb(s, d), data: count })
}

export const getCountOfGameInDb = (s, d) => {
  return Taro.getStorageSync(countOfGameInDb(s, d)) || BASE_COUNT_OF_GAME
}

// 当前游戏在本地数据库中的位置
export const getIndexOfGameInDb = (s, d) => {
  return Taro.getStorageSync(indexOfGameInDb(s, d))
}

export const setIndexOfGameInDb = (s, d, index) => {
  return Taro.setStorage({ key: indexOfGameInDb(s, d), data: index })
}

// 加载/保存服务端获取的题库到本地缓存
export const loadDbFromStorage = (s, d) => {
  return Taro.getStorage({ key: storageDbName(s, d) }).then(r => r.data)
}

export const setDbToStorage = (s, d, data) => {
  return Taro.setStorage({ key: storageDbName(s, d), data })
}

/**
 * Game
 * */

export const tagGameIsFinished = id => {
  return Taro.setStorage({ key: finishedGame(id), data: '1' })
}

export const chechGameIsFinishedById = id => {
  const data = Taro.getStorageSync(finishedGame(id))
  return data === '1'
}

/**
 * 游戏统计数据
 * 对象1-4表示各个难度
 * {
 *   1: {
 *      total: Number 游戏总次数
 *      win: Number 胜利次数
 *      winNoMistake: Number 无错情况下胜利
 *      bestTime: Number 最佳时间（秒）
 *      totalTime: Number 总时间（秒）
 *      streak: Number 连胜
 *      longStreak: Number 最长连胜
 *   }
 *   ...
 * }
 * */

export const getGameStats = () => {
  const data = Taro.getStorageSync(gameStats) || '{}'
  return JSON.parse(data)
}
export const setGameStats = data => {
  return Taro.setStorage({ key: gameStats, data: JSON.stringify(data) })
}

/**
 * 未完成的游戏
 * {
 *  game: {
 *    result: Object
 *    userBoard: Array,
 *    mistake: Number
 *    notesGrid: Array
 *  },
 *  time: {
 *    base: Number (redux中time里的base字段)
 *  }
 * }
 * */

export const getUndoneGame = () => {
  const data = Taro.getStorageSync(undoneGame) || '{}'
  return JSON.parse(data)
}
export const setUndoneGame = data => {
  return Taro.setStorage({ key: undoneGame, data: JSON.stringify(data) })
}
export const removeUndoneGame = () => {
  return Taro.removeStorage({ key: undoneGame })
}

export const getOffSound = () => {
  const data = Taro.getStorageSync(offSound)
  return data === '1'
}

export const setOffSound = data => {
  return Taro.setStorage({ key: offSound, data })
}
