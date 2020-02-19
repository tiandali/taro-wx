/**
 * DataBase
 * */
export const dbSourceInfo = 'db_source'
export const BASE_COUNT_OF_GAME = 1000
export const gameStats = 'game_stats'
export const undoneGame = 'undone_game'
export const offSound = 'off_sound'

// 对应 boardSize 和 diffcully 的题库，当前使用的数据最后一个对应的服务端db的 index
export const countOfGameInDb = (size, difficulty) =>
  `db_c_s${size}_d${difficulty}`

// 对应 boardSize 和 diffcully 的题库，当前正在玩的游戏对应本地db 的index
export const indexOfGameInDb = (size, difficulty) =>
  `db_idx_s${size}_d${difficulty}`

// 对应 boardSize 和 diffcully 的题库，当前正在玩的游戏对应本地db 的index
export const storageDbName = (size, difficulty) => `db_s${size}_d${difficulty}`

/**
 * Game
 * */

// game 是否玩过
export const finishedGame = (id = '') => `over_${id}`
