import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'

class GameSheet extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { isOpen, onCloseMenu, onNewGame, difficulty, onRestartGame } = this.props
    return (
      <AtActionSheet
        isOpened={isOpen}
        cancelText='取消'
        onClose={() => {
          onCloseMenu && onCloseMenu()
        }}
        onCancel={() => {
          onCloseMenu && onCloseMenu()
        }}
      >
        <AtActionSheetItem onClick={() => onNewGame && onNewGame(1)}>
          容易
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => onNewGame && onNewGame(2)}>
          中等
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => onNewGame && onNewGame(3)}>
          困难
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => onNewGame && onNewGame(4)}>
          专家
        </AtActionSheetItem>
        {difficulty ? (
          <AtActionSheetItem onClick={() => onNewGame && onRestartGame()}>
            重新开始
          </AtActionSheetItem>
        ) : null}
      </AtActionSheet>
    )
  }
}
const mapStateToProps = ({ game }) => {
  const {
    result: { difficulty }
  } = game
  return {
    difficulty
  }
}
export default connect(mapStateToProps)(GameSheet)
