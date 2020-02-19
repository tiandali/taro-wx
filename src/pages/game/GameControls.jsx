import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {
  switchNoteBtn,
  clean,
  // getAnswer,
  undoPrevStep
} from '../../actions/game'

import iconUndo from '../../images/icon_undo.svg'
import iconErase from '../../images/icon_erase.svg'
import iconNotes from '../../images/icon_notes.svg'
// import iconHint from '../../images/icon_hint.svg'
import './styles/gamecontrols.scss'

class GameControls extends Component {
  constructor(props) {
    super(props)
  }

  handleNoteBtn = () => {
    const { dispatch } = this.props
    dispatch(switchNoteBtn())
  }

  handleCleanCell = () => {
    this.props.dispatch(clean())
  }

  handleUndo = () => {
    this.props.dispatch(undoPrevStep())
  }

  // handleHint = () => {
  //   const {
  //     selected: { index },
  //     hintCount
  //   } = this.props
  //   if (Number.isNaN(index) || hintCount <= 0) {
  //     return
  //   }
  //   this.props.dispatch(getAnswer(index))
  // }

  render() {
    const { openNote } = this.props
    return (
      <View className='game-controls-btns'>
        <View className='game-controls-item' onClick={this.handleUndo}>
          <View className='game-controls-iconbox'>
            <Image className='game-controls-icon' src={iconUndo} />
          </View>
          <View className='game-controls-label'>撤销</View>
        </View>
        <View className='game-controls-item' onClick={this.handleCleanCell}>
          <View className='game-controls-iconbox'>
            <Image className='game-controls-icon' src={iconErase} />
          </View>
          <View className='game-controls-label'>擦除</View>
        </View>
        <View
          className={`game-controls-item ${openNote ? 'notes-open' : 'notes'}`}
          onClick={this.handleNoteBtn}
        >
          <View className='game-controls-iconbox'>
            <Image className='game-controls-icon' src={iconNotes} />
            <View className='notes-btn'>{openNote ? '开' : '关'}</View>
          </View>
          <View className='game-controls-label'>笔记</View>
        </View>
        {/* <View className='game-controls-item' onClick={this.handleHint}>
          <View className='game-controls-iconbox'>
            <Image className='game-controls-icon' src={iconHint} />
            <View className='hint-count'>{this.props.hintCount}</View>
          </View>
          <View className='game-controls-label'>提示</View>
        </View> */}
      </View>
    )
  }
}

const mapStateToProps = ({ game }) => {
  const { openNote } = game
  return {
    openNote
    // selected: game.selected,
    // hintCount: game.hintCount
  }
}

export default connect(mapStateToProps)(GameControls)
