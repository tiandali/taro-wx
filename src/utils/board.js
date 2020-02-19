import Taro from '@tarojs/taro'

export const _BOART_SIZE_ = 9
export const _BOART_DATA_SIZE_ = _BOART_SIZE_ * _BOART_SIZE_
const _BOARD_TRANSLATE_MAP_ = {
  '1': 'a',
  '2': 'b',
  '3': 'c',
  '4': 'd',
  '5': 'e',
  '6': 'f',
  '7': 'g',
  '8': 'h',
  '9': 'i',
  a: '1',
  b: '2',
  c: '3',
  d: '4',
  e: '5',
  f: '6',
  g: '7',
  h: '8',
  i: '9'
}

export function transformFromSdkBoard(board = []) {
  if (board.length !== _BOART_DATA_SIZE_) {
    return new Error(
      `The length of board should be ${_BOART_DATA_SIZE_}, but get ${board.length}`
    )
  }
  const newBoardData = []
  for (let x = 0; x < _BOART_SIZE_; x++) {
    for (let y = 0; y < _BOART_SIZE_; y++) {
      let item = { x, y, v: board[x * _BOART_SIZE_ + y], notes: [] }
      if (board[x * _BOART_SIZE_ + y] > 0) {
        item.gameValue = true
      }
      newBoardData.push(item)
    }
  }

  return newBoardData
}

export function transformToSdkBoardStr(userBoard) {
  if (userBoard.length !== _BOART_DATA_SIZE_) {
    return new Error(
      `The length of board should be ${_BOART_DATA_SIZE_}, but get ${userBoard.length}`
    )
  }
  return userBoard.map(item => [item.v, ...item.notes].join(',')).join('-')
}

export function toString(result = {}) {
  const strArr = result.board.map((v, i) => {
    if (v === 0) {
      return _BOARD_TRANSLATE_MAP_[result.answer[i]]
    } else {
      return v
    }
  })
  // console.log('strArr:', strArr.toString())
  return result.difficulty + ':' + strArr.join('')
}

export function fromString(str = '') {
  const [difficulty, data] = str.split(':')
  const board = []
  const answer = []
  for (let i = 0; i < data.length; i++) {
    const v = Number(data[i])
    if (v > 0) {
      // is int
      board.push(v)
      answer.push(v)
    } else {
      // isn't int
      board.push(0)
      answer.push(Number(_BOARD_TRANSLATE_MAP_[data[i]]))
    }
  }
  return {
    board,
    answer,
    difficulty: Number(difficulty)
  }
}

export function decodeFromId(str) {
  let board = []
  const data = new DataView(Taro.base64ToArrayBuffer(str))
  for (let i = 0; i < data.byteLength; i++) {
    const v = data.getUint8(i)
    const l = v & 0x0f
    const h = (v >> 4) & 0x0f
    board.push(l)
    board.push(h)
  }
  return board.slice(0, 81)
}

export function encodeToId(board = []) {
  const intArr = []
  const len = Math.floor((board.length + 1) / 2)
  for (let i = 0; i < len; i++) {
    let value = board[2 * i]
    if (2 * i + 1 < board.length) {
      value |= board[2 * i + 1] << 4
    }
    intArr.push(value)
  }
  return Taro.arrayBufferToBase64(Uint8Array.from(intArr))
}
