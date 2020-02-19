import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { input, addNotes, switchPause } from '../../actions/game'

import './styles/numpad.scss'

// const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]

class NumPad extends Component {
  constructor(props) {
    super(props)
  }

  handleInput = (cellIndex, value) => {
    const { dispatch, openNote, pauseGame } = this.props
    if (pauseGame) {
      dispatch(switchPause())
      return
    }
    if (openNote) {
      dispatch(addNotes(cellIndex, value))
    } else {
      dispatch(input(cellIndex, value))
    }
  }

  render() {
    const { openNote, selected, numPadArr } = this.props
    return (
      <View className={`numpad ${openNote ? 'notes-open' : ''}`}>
        {numPadArr.map(item => {
          let classStr = 'numpad-item'
          if (item.hide) {
            classStr += ' hide'
          }
          if (item.hasNote) {
            classStr += ' hasNote'
          }
          return (
            <View
              key={item.num}
              className={classStr}
              onClick={() => {
                if (!openNote && item.hide) {
                  return
                }
                this.handleInput(selected.index, item.num)
              }}
            >
              {item.num}
            </View>
          )
        })}
      </View>
    )
  }
}
const defaultNums = [
  { num: 1 },
  { num: 2 },
  { num: 3 },
  { num: 4 },
  { num: 5 },
  { num: 6 },
  { num: 7 },
  { num: 8 },
  { num: 9 }
]
const mapStateToProps = ({ game }) => {
  const {
    result: { answer },
    userBoard,
    openNote,
    selected,
    pauseGame
  } = game
  let numPadArr = JSON.parse(JSON.stringify(defaultNums))
  if (openNote) {
    if (selected.notes && selected.notes.length) {
      numPadArr.forEach((item, i) => {
        const isExist = selected.notes.includes(item.num)
        if (isExist) {
          numPadArr[i].hasNote = true
        }
      })
    }
  } else {
    let nums = []
    userBoard.forEach((item, i) => {
      if (item.v < 1 || item.mistakeValue) {
        if (!nums.includes(answer[i])) {
          nums.push(answer[i])
        }
      }
    })
    numPadArr.forEach((item, i) => {
      const isNotExist = !nums.includes(item.num)
      if (isNotExist) {
        numPadArr[i].hide = true
      }
    })
  }
  return {
    openNote,
    selected,
    pauseGame,
    numPadArr
  }
}

export default connect(mapStateToProps)(NumPad)
