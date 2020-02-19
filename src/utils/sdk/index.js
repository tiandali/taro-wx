/// <reference path="./index.d.ts" />
import { transformToSdkBoardStr } from '../board'
import * as sdkInterface from './interface'
import { generateFromLocal } from '../db'

const gameLevel = sdkInterface.gameLevel

/**
 * 新建游戏接口，返回布局和正确结果，请注意保存好正确结果
 *
 * @param {int} boardSize 9
 * @param {int} boardDifficulty >0
 * @returns
 */
async function generate(boardSize, boardDifficulty) {
  if (boardDifficulty === 1) {
    return sdkInterface.generate(boardSize, boardDifficulty)
  } else {
    return await generateFromLocal(boardSize, boardDifficulty)
  }
}

/**
 *  获取下一部提示
 *
 * @param {any} boardData 当前棋盘数据， 应确保没有填错的书
 * @example
 * // returns {"path":[{"id":"2","triggers":"null","cells":"[3]","num":"2","candidates":"null","houses":"[0, 3, 1]","houseType":"[0, 1, 2]","updatedCandidates":"false"}],"useNotes":true}
 * path: 支持的策略array，
 * useNotes:
 *
 * item.id: 策略 id
 * item.triggers: 触发的位置
 * item.cells: 目标表格单元
 * item.updatedCandidates 是否是更新候选数，决定是修改 num or candidates
 * item.num 根据 updatedCandidates判断取值
 * item.candidates: 根据 updatedCandidates判断取值
 * item.houses: 策略对应的位置的值，每项为 0~8，该值对应key看 houseType
 * item.houseType: houses 为value, houseType 为key， houseType 可能的值有0：行， 1：列， 2：宫
 *
 * @returns {Object} { path: []<Object>, updatedCandidates: boolean }
 */
function solveStep(boardData) {
  const str = transformToSdkBoardStr(boardData)
  return sdkInterface.solveStep(str)
}

/**
 * 获取棋盘所以候选数
 *
 * @param {any} boardData 当前棋盘数据，应确保没有填错的书
 * @returns {Array<Array<Number>>}
 */

function getCandidates(boardData) {
  solveStep(boardData) // 载入棋盘到sdk
  return sdkInterface.getCandidates()
}

export { generate, solveStep, gameLevel, getCandidates }
