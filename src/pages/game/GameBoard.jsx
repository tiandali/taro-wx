import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Image } from '@tarojs/components'
import GameCell from './GameCell'
import { switchPause } from '../../actions/game'
import { sudokuPos } from '../../config/gameConfig'
import iconPlay from '../../images/icon-play.svg'

import './styles/gameboard.scss'

const cellArr = [...Array(9).fill([...Array(9).keys()])]

class GameBoard extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.pauseGameClass !== nextProps.pauseGameClass) {
      return true
    }
    return false
  }

  handlePause = () => {
    const { dispatch } = this.props
    dispatch(switchPause())
  }

  render() {
    const { pauseGameClass } = this.props
    const gameContent = cellArr.map((rI, row) => {
      return (
        <View className='game-row' key={'row' + row}>
          {rI.map((cI, col) => (
            <GameCell
              key={row * 9 + col + ''}
              x={row}
              y={col}
              index={row * 9 + col}
              sudokuPos={sudokuPos[row * 9 + col]}
            />
          ))}
        </View>
      )
    })
    return (
      <View className={`game-wrapper ${pauseGameClass}`}>
        <View className='pause-overlay'>
          <View className='icon-play-big'>
            <Image
              className='icon-play'
              src={iconPlay}
              onClick={this.handlePause}
            />
          </View>
        </View>
        <View className='game-outer'>
          <View className='game-board'>
            <View className='out-box'>{gameContent}</View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = ({ game }) => {
  const { pauseGame } = game
  let pauseGameClass = ''
  if (pauseGame) {
    pauseGameClass = 'pause'
  }
  return {
    pauseGameClass
  }
}
export default connect(mapStateToProps)(GameBoard)
