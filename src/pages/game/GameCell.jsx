import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { selectCell } from '../../actions/game'

import './styles/gamecell.scss'

const noteArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]

class GameCell extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.cellClassStr !== nextProps.cellClassStr) {
      return true
    }
    if (this.props.v !== nextProps.v) {
      return true
    }
    if (this.props.notes !== nextProps.notes) {
      return true
    }
    if (this.props.highlightNotes !== nextProps.highlightNotes) {
      return true
    }
    return false
  }

  handleSelectCell = () => {
    const { x, y, index, sudokuPos, v, notes } = this.props
    this.props.dispatch(selectCell({ x, y, index, sudokuPos, v, notes }))
  }

  render() {
    const {
      x,
      y,
      index,
      v,
      notes,
      cellClassStr,
      styles,
      renderNotes,
      highlightNotes
    } = this.props
    return (
      <View
        key={index}
        className={cellClassStr}
        style={{ ...styles }}
        onClick={this.handleSelectCell}
      >
        <View className='cell-value'>{v ? v : null}</View>
        {renderNotes && (
          <View className='pencil-grid'>
            <View className='at-row at-row--wrap pencil-grid-box'>
              {noteArr.map(noteNum => {
                let classStr = 'at-col at-col-4 pencil-grid-cell'
                if (notes.includes(noteNum)) {
                  classStr += ' hasValue'
                  if (highlightNotes.includes(noteNum)) {
                    classStr += ' highlight-note'
                  }
                }
                return (
                  <View
                    key={x * 9 + y + '_note_' + noteNum}
                    className={classStr}
                  >
                    {noteNum}
                  </View>
                )
              })}
            </View>
          </View>
        )}
      </View>
    )
  }
}

const getClassNameStr = (options = {}) => {
  let classStr = 'game-cell'
  const {
    x,
    y,
    sudokuPos,
    index,
    cellData: { v, gameValue },
    answer,
    selected
  } = options
  if (gameValue) {
    classStr += ' game-value'
  } else if (v && v !== answer) {
    classStr += ' mistake'
  }
  if (index === selected.index) {
    classStr += ' cell-selected'
  }
  if (v && v === selected.v) {
    classStr += ' highlight-number'
  }
  if (
    x === selected.x ||
    y === selected.y ||
    sudokuPos === selected.sudokuPos
  ) {
    classStr += ' highlight-table'
    if (v && v === selected.v && index !== selected.index) {
      classStr += ' conflict'
    }
  }
  return classStr
}

const mapStateToProps = ({ game }, props) => {
  const {
    pauseGame,
    userBoard,
    selected,
    result: { answer }
  } = game
  const { x, y, index } = props
  let styles = {}
  if ((x + 1) % 3 === 0) {
    styles.borderBottom = '1px solid transparent'
  }
  if ((y + 1) % 3 === 0) {
    styles.borderRight = '1px solid transparent'
  }
  const cellData = userBoard[index] || {}
  const v = cellData.v
  const notes = cellData.notes || []
  const cellClassStr = getClassNameStr({
    ...props,
    pauseGame,
    cellData,
    answer: answer[index],
    selected
  })
  const renderNotes = !v || cellClassStr.includes('mistake')
  let highlightNotes = []
  if (selected.v && notes.includes(selected.v)) {
    highlightNotes.push(selected.v)
  }
  return {
    v,
    notes,
    cellClassStr,
    styles,
    renderNotes,
    highlightNotes
  }
}
export default connect(mapStateToProps)(GameCell)
