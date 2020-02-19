import jsSdk from './lib-v1.1.2'

// 1~4, easy, medium, hard, veryHard
const gameLevel = [1, 2, 3, 4]

/**
 * 新建游戏接口，返回布局和正确结果，请注意保存好正确结果
 *
 * @param {int} boardSize 9
 * @param {int} boardDifficulty >0
 * @returns
 */
function generate(boardSize, boardDifficulty) {
  return JSON.parse(jsSdk.generateForJs(boardSize, boardDifficulty))
}

/**
 *  获取下一部提示
 *
 * @param {string} str 当前棋盘数据转化成的字符串
 * @example
 *
 * @returns {Object} { path: []<Object>, updatedCandidates: boolean }
 */
function solveStep(str) {
  return JSON.parse(jsSdk.solveStepForJs(str))
}

/**
 * 获取棋盘所以候选数
 *
 * @param {any} boardData 当前棋盘数据，应确保没有填错的书
 * @returns {Array<Array<Number>>}
 */
function getCandidates() {
  return JSON.parse(jsSdk.getCandidatesForJs())
}

export { generate, solveStep, gameLevel, getCandidates }
