import Taro from '@tarojs/taro'
import * as sdk from '../utils/sdk/index'
import { _BOART_SIZE_, transformFromSdkBoard } from '../utils/board'
import * as timeActions from './time'
import {
  removeUndoneGame,
  tagGameIsFinished,
  getIndexOfGameInDb
} from '../utils/storage'
import { storageGameOver } from '../actions/storageData'
import { audioTypes, audioPlay } from '../utils/audio'
import { moveToNextInDb } from '../utils/db'

export const types = {
  clearGame: 'game_clearGame',
  newGame: 'game_newGame',
  switchNote: 'game_switchNote',
  switchPause: 'game_switchPause',
  switchTimer: 'game_switchTimer',
  inputValue: 'game_inputValue',
  addNote: 'game_addNote',
  inputMistake: 'game_inputMistake',
  selectCell: 'game_selectCell',
  cleanCell: 'game_cleanCell',
  hintCount: 'game_hintCount',
  undoPrevStep: 'game_undoPrevStep',
  clearStep: 'game_clearStep',
  exitGamePage: 'game_exitGamePage'
}
const setData = (data, type) => {
  return { data, type }
}

/**
 * 开始新游戏
 *
 * @param {*} diffcurty
 */
export function newGame(difficulty) {
  return async dispatch => {
    if (difficulty !== 1) {
      let oldIndex = getIndexOfGameInDb(9, difficulty)
      if (!oldIndex && oldIndex !== 0) {
        oldIndex = -1
      }
      moveToNextInDb(9, difficulty, oldIndex)
    }
    const result = await sdk.generate(_BOART_SIZE_, difficulty)
    const userBoard = transformFromSdkBoard(result.board)
    // const notesGrid = sdk.getCandidates(userBoard)
    dispatch(timeActions.reStart())
    dispatch(
      setData({ result, userBoard, selected: {}, userStep: [] }, types.newGame)
    )
    removeUndoneGame()
  }
}

/**
 * 继续上局
 */
export function initUndoneGame(data) {
  return dispatch => {
    dispatch({ data, type: types.newGame })
  }
}

/**
 * 选中格子
 *
 */
export function selectCell(data) {
  return (dispatch, getState) => {
    const {
      selected,
      result: { answer }
    } = getState().game
    const { index, v } = data
    if (index === selected.index) {
      return
    }
    if (v && v !== answer[index]) {
      data.mistakeValue = true
    }
    dispatch(setData(data, types.selectCell))
  }
}

/**
 * 在一个格子内填入值
 *
 * @param {*} cell
 * @param {*} value
 */
export function input(cell, value) {
  return (dispatch, getState) => {
    let {
      userBoard,
      selected,
      result: { answer, board, difficulty },
      mistake,
      userStep
    } = getState().game
    if (!selected.sudokuPos) {
      Taro.vibrateLong()
      return
    } else if (selected.v && !selected.mistakeValue) {
      if (userBoard[cell].gameValue) {
        audioPlay(audioTypes.invalid)
      }
      Taro.vibrateLong()
      return
    } else if (selected.v && selected.mistakeValue && value === selected.v) {
      Taro.vibrateLong()
      return
    }
    userStep.push(userBoard[cell])
    userBoard[cell] = {
      ...userBoard[cell],
      v: value,
      notes: []
    }
    selected.v = value
    selected.notes = []
    if (value !== answer[cell]) {
      userBoard[cell].mistakeValue = true
      selected.mistakeValue = true
      mistake += 1
      audioPlay(audioTypes.mistake)
      Taro.vibrateLong()
      if (mistake >= 3) {
        dispatch(switchTimer(true))
        dispatch(storageGameOver())
        removeUndoneGame()
      }
    } else {
      delete userBoard[cell].mistakeValue
      delete selected.mistakeValue
    }
    // const notesGrid = sdk.getCandidates(userBoard)
    const gameSuccess = userBoard.every(item => item.v && !item.mistakeValue)
    if (gameSuccess) {
      audioPlay(audioTypes.doneGame)
      dispatch(switchTimer(true))
      if (difficulty !== 1) {
        tagGameIsFinished(board)
      }
      removeUndoneGame()
    }
    audioPlay(audioTypes.right)
    dispatch(
      setData(
        { userBoard, selected, mistake, gameSuccess, userStep },
        types.inputValue
      )
    )
  }
}

/**
 * 在一个格子内设置候选数
 *
 * @param {*} cell
 * @param {*} value
 */
export function addNotes(cell, value) {
  return (dispatch, getState) => {
    let { userBoard, userStep, selected } = getState().game
    if (!selected.sudokuPos) {
      Taro.vibrateLong()
      return
    } else if (selected.v && !selected.mistakeValue) {
      if (userBoard[cell].gameValue) {
        audioPlay(audioTypes.invalid)
      }
      Taro.vibrateLong()
      return
    }
    // notesGrid
    // const cellNotes = notesGrid[cell]
    // 如果该宫格内可填写的notes不包含输入的值，则跳出函数
    // if (!cellNotes.includes(value)) {
    //   return
    // }
    const { notes } = userBoard[cell]
    let newNotes = []
    if (notes.includes(value)) {
      newNotes = notes.filter(n => n !== value)
    } else {
      newNotes = [...notes, value]
    }
    userStep.push(userBoard[cell])
    userBoard[cell] = {
      ...userBoard[cell],
      notes: [...new Set(newNotes)]
    }
    selected.notes = [...new Set(newNotes)]
    audioPlay(audioTypes.noteInput)
    dispatch(setData({ userBoard, selected, userStep }, types.addNote))
  }
}

/**
 * 清空一个格子的内容，包括value，note, 初始化填好的的不允许clean
 *
 */
export function clean() {
  return (dispatch, getState) => {
    let { userBoard, selected, userStep, pauseGame } = getState().game
    if (pauseGame) {
      dispatch(switchPause())
      return
    }
    const { index, v, notes = [], sudokuPos } = selected
    if (!sudokuPos || (!v && !notes.length)) {
      audioPlay(audioTypes.invalid)
      Taro.vibrateLong()
      return
    } else if (index > -1 && userBoard[index].gameValue) {
      audioPlay(audioTypes.invalid)
      Taro.vibrateLong()
      return
    }
    userStep.push(userBoard[index])
    userBoard[index] = {
      ...userBoard[index],
      v: 0,
      notes: []
    }
    selected.v = 0
    selected.notes = []
    delete selected.mistakeValue
    audioPlay(audioTypes.erase)
    dispatch(setData({ userBoard, selected }, types.cleanCell))
  }
}

/**
 * 撤销一步
 *
 */
export function undoPrevStep() {
  return (dispatch, getState) => {
    let { userStep, userBoard, selected, pauseGame } = getState().game
    if (pauseGame) {
      dispatch(switchPause())
      return
    }
    const len = userStep.length
    if (!len) {
      audioPlay(audioTypes.invalid)
      Taro.vibrateLong()
      return
    }
    const prevStep = userStep[len - 1]
    const { x, y } = prevStep
    const cell = x * 9 + y
    userBoard[cell] = { ...prevStep }
    if (selected.index === cell) {
      selected.v = prevStep.v
      selected.notes = prevStep.notes
    }
    userStep.pop()
    audioPlay(audioTypes.undo)
    dispatch(setData({ userStep, userBoard, selected }, types.undoPrevStep))
  }
}

// 清空记录玩家步数的数组
export function clearStep() {
  return dispatch => {
    dispatch({ type: types.clearStep })
  }
}

// 退出游戏页面
export function exitGamePage() {
  return dispatch => {
    dispatch({ type: types.exitGamePage })
  }
}

/**
 * 重新开始游戏
 *
 */
export function restartGame() {
  return (dispatch, getState) => {
    let { result, userBoard } = getState().game
    if (!userBoard.length) {
      return
    }
    dispatch(timeActions.reStart())
    userBoard = userBoard.map(item => {
      if (!item.gameValue) {
        return {
          ...item,
          v: 0,
          notes: []
        }
      } else {
        return item
      }
    })
    // const notesGrid = sdk.getCandidates(userBoard)
    dispatch(setData({ result, userBoard }, types.newGame))
  }
}

/**
 * 开启/关闭 笔记按钮
 *
 */
export function switchNoteBtn() {
  return (dispatch, getState) => {
    const { openNote, pauseGame } = getState().game
    if (pauseGame) {
      dispatch(switchPause())
      return
    }
    audioPlay(audioTypes.noteSwitch)
    dispatch(setData(!openNote, types.switchNote))
  }
}

/**
 * 暂停/开启 游戏
 *
 */
export function switchPause() {
  return (dispatch, getState) => {
    const { pauseGame } = getState().game
    dispatch(setData(!pauseGame, types.switchPause))
    dispatch(timeActions.targetPause(pauseGame))
  }
}
// 暂停/开启计时器
export function switchTimer(pauseTimer) {
  return dispatch => {
    dispatch(setData(pauseTimer, types.switchTimer))
    dispatch(timeActions.targetPause(!pauseTimer))
  }
}

/**
 * 玩家填错数字
 *
 */
export function inputMistake() {
  return (dispatch, getState) => {
    const { mistake } = getState().game
    const newMistakeCount = mistake + 1
    dispatch(setData(newMistakeCount, types.inputMistake))
  }
}

export function getHint() {
  return (dispatch, getState) => {
    const { userBoard } = getState().game
    const hint = sdk.solveStep(userBoard)
    console.error('hint:', hint)
  }
}

export function getAnswer(cell) {
  return (dispatch, getState) => {
    let {
      result: { answer },
      hintCount
    } = getState().game
    if (hintCount <= 0) {
      return
    }
    const value = answer[cell]
    hintCount -= 1
    dispatch(setData(hintCount, types.hintCount))
    dispatch(input(cell, value))
  }
}

const INITIAL_STATE = {
  mistake: 0,
  pauseGame: false,
  pauseTimer: false,
  openNote: false,
  hintCount: 3,
  selected: {},
  result: {
    answer: [],
    board: [],
    difficulty: 0
  },
  userBoard: [],
  userStep: [],
  gameOver: false,
  gameSuccess: false
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.clearGame: {
      return INITIAL_STATE
    }
    case types.newGame: {
      return {
        ...INITIAL_STATE,
        ...action.data
      }
    }
    case types.inputValue: {
      return {
        ...state,
        ...action.data
      }
    }
    case types.addNote: {
      return {
        ...state,
        userBoard: action.data.userBoard,
        userStep: action.data.userStep
      }
    }
    case types.inputMistake: {
      return {
        ...state,
        mistake: action.data
      }
    }
    case types.selectCell: {
      return {
        ...state,
        selected: action.data
      }
    }
    case types.cleanCell: {
      return {
        ...state,
        ...action.data
      }
    }
    case types.switchNote: {
      return {
        ...state,
        openNote: action.data
      }
    }
    case types.switchPause: {
      return {
        ...state,
        pauseGame: action.data,
        pauseTimer: action.data
      }
    }
    case types.switchTimer: {
      return {
        ...state,
        pauseTimer: action.data
      }
    }
    case types.hintCount: {
      return {
        ...state,
        hintCount: action.data
      }
    }
    case types.undoPrevStep: {
      return {
        ...state,
        ...action.data
      }
    }
    case types.clearStep: {
      return {
        ...state,
        userStep: []
      }
    }
    case types.exitGamePage: {
      return {
        ...state,
        selected: {},
        pauseGame: false,
        pauseTimer: false
      }
    }
    default:
      return state
  }
}
