import l2 from '../data/2-1000'
import l3 from '../data/3-1000'
import l4 from '../data/4-1000'
import { fromString, encodeToId } from './board'
import {
  getIndexOfGameInDb,
  tagGameIsFinished,
  chechGameIsFinishedById,
  getCountOfGameInDb,
  setIndexOfGameInDb,
  getDBSource,
  setCountOfGameInDb,
  loadDbFromStorage,
  setDbToStorage,
  addToDBSource
} from './storage'
import { getMoreGames } from './api'

const PRE_FETCH_TRIGER = 4
const SUPPORTED_SIZE = [9]
const SUPPORTED_DIFFICULTY = [2, 3, 4]

// 初始化，引用内置的 1000 * 3 组游戏
// level 1~4
const gameDb = {
  game_9: {
    l2: l2.split(','),
    l3: l3.split(','),
    l4: l4.split(',')
  }
}

// 将 board size/diffcullty 序列话后存本地， 用于标记
// 此db需要使用缓存置换内置的游戏
const encodeDbKeys = (s, d) => s + '_' + d
const decodeDbKeys = (str = '') => str.split('_')

// 从缓存加载需要更换的数据
export const initDb = async () => {
  try {
    const needUpdatedDbs = await getDBSource()
    for (let i = 0; i < needUpdatedDbs.length; i++) {
      const [s, d] = decodeDbKeys(needUpdatedDbs[i])
      gameDb[`game_${s}`][`l${d}`] = await loadDbFromStorage(s, d)
    }
  } catch (error) {
    console.error('initDb err:', error)
  }
}
initDb()

async function fetchFormServer(s, d) {
  const lastIndex = getCountOfGameInDb(s, d)
  const newGames = await getMoreGames(s, d, lastIndex)
  // 保存 db 数据
  await setDbToStorage(s, d, newGames)
  // 标记 此db 需要从缓存加载
  await addToDBSource(encodeDbKeys(s, d))
  // 重置 此db index
  await setCountOfGameInDb(s, d, lastIndex + newGames.length)
  await setIndexOfGameInDb(s, d, 0)
}

export async function moveToNextInDb(boardSize, boardDifficulty, oldIndex) {
  // TODO:
  console.log('moveToNextInDb', boardDifficulty, oldIndex)
  await setIndexOfGameInDb(boardSize, boardDifficulty, 1 + oldIndex)
}

export async function loadGameFromDbByIndex(
  boardSize,
  boardDifficulty,
  nextIndex
) {
  if (
    !SUPPORTED_SIZE.includes(boardSize) ||
    !SUPPORTED_DIFFICULTY.includes(boardDifficulty)
  ) {
    throw new Error(
      `loadGameFromDbByIndex failed! s:${boardSize}, d:${boardDifficulty}`
    )
  }
  const db = gameDb[`game_${boardSize}`][`l${boardDifficulty}`]
  if (!db[nextIndex]) {
    throw new Error(`loadGameFromDbByIndex failed: not found new game!`)
  }

  const game = fromString(db[nextIndex])
  const gameId = encodeToId(game.board)

  if (!chechGameIsFinishedById(gameId)) {
    if (db.length < nextIndex + 1 + PRE_FETCH_TRIGER) {
      // 检查是否需要从服务端拉取
      fetchFormServer(boardSize, boardDifficulty, nextIndex)
    }
    return game
  } else {
    tagGameIsFinished(gameId, boardDifficulty)
    moveToNextInDb(boardSize, boardDifficulty, nextIndex)
    return await loadGameFromDbByIndex(boardSize, boardDifficulty, nextIndex)
  }
}

export async function generateFromLocal(boardSize, boardDifficulty) {
  let nextIndex = 0
  try {
    nextIndex = getIndexOfGameInDb(boardSize, boardDifficulty) || nextIndex
  } catch (e) {
    console.error('[可忽略]load nextIndex from storage err:', e)
  }

  return loadGameFromDbByIndex(boardSize, boardDifficulty, nextIndex)
}
