import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtModal, AtModalContent, AtButton } from 'taro-ui'
import {
  switchPause,
  newGame,
  restartGame,
  clearStep,
  exitGamePage,
  switchTimer
} from '../../actions/game'
import { updateGameStats } from '../../actions/storageData'
import { setGameStats } from '../../utils/storage'
import { getUri, routePaths } from '../../routes'
// import TopBar from '../../components/TopBar'
import GameBoard from './GameBoard'
import GameControls from './GameControls'
import NumPad from './NumPad'
import Timer from './Timer'
import GameSheet from '../../components/GameSheet'
import { difficultyData } from '../../config/gameConfig'

import './game.scss'

@connect(({ game, time, storageData }) => ({
  mistake: game.mistake,
  difficulty: game.result.difficulty,
  gameSuccess: game.gameSuccess,
  doneTime: time.base,
  gameStats: storageData.gameStats,
  pauseTimer: game.pauseTimer,
  pauseGame: game.pauseGame
}))
class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.config = {
      navigationBarTitleText: ''
    }
  }

  // componentWillMount() {
  //   console.error(this.$router.params)
  // }

  componentDidUpdate(prevProps) {
    const { gameSuccess } = this.props
    if (gameSuccess && gameSuccess !== prevProps.gameSuccess) {
      const { difficulty, gameStats } = this.props
      const newData = this.handleStats()
      const newStats = {
        ...gameStats,
        [difficulty]: {
          ...newData
        }
      }
      this.props.dispatch(updateGameStats(newStats))
      setGameStats(newStats)
      setTimeout(() => {
        Taro.redirectTo({
          url: getUri(routePaths.success)
        })
      }, 500)
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearStep())
    this.props.dispatch(exitGamePage())
    if (this.props.mistake >= 3) {
      this.props.dispatch({ type: 'game_clearGame' })
    }
  }

  componentDidShow() {
    if (!this.props.pauseGame && this.props.pauseTimer) {
      this.props.dispatch(switchTimer(false))
    }
  }

  componentDidHide() {
    if (!this.props.pauseTimer) {
      this.props.dispatch(switchTimer(true))
    }
  }

  onShareAppMessage() {
    return {
      title: '震惊，清华博士居然解不出来这道小学谜题！',
      path: '/pages/index/index?share=game'
    }
  }

  handleStats = () => {
    const { mistake, difficulty, doneTime, gameStats } = this.props
    const gameData = gameStats[difficulty] || {}
    const {
      total = 0,
      win = 0,
      winNoMistake = 0,
      bestTime = 0,
      totalTime = 0,
      totalWinTime = 0,
      streak = 0,
      longStreak = 0
    } = gameData
    let newBestTime = bestTime
    if (bestTime) {
      newBestTime = bestTime < doneTime ? bestTime : doneTime
    } else {
      newBestTime = doneTime
    }
    let newWinNoMistake = winNoMistake
    if (mistake === 0) {
      newWinNoMistake = winNoMistake + 1
    }
    let newStreak = streak + 1
    let newLongStreak = longStreak
    if (newStreak > newLongStreak) {
      newLongStreak = newStreak
    }
    const newData = {
      total: total + 1,
      win: win + 1,
      winNoMistake: newWinNoMistake,
      bestTime: newBestTime,
      totalTime: totalTime + doneTime,
      totalWinTime: totalWinTime + doneTime,
      streak: newStreak,
      longStreak: newLongStreak
    }
    return newData
  }

  backHome = () => {
    Taro.redirectTo({
      url: getUri(routePaths.index, { from: 'game' })
    })
  }

  handlePause = () => {
    const { dispatch } = this.props
    dispatch(switchPause())
  }

  handleOpenMenu = () => {
    this.setState({ isOpen: true })
  }
  handleCloseMenu = () => {
    this.setState({ isOpen: false })
  }

  handleNewGame = difficulty => {
    this.handleCloseMenu()
    this.props.dispatch(newGame(difficulty))
  }

  handleRestartGame = () => {
    this.handleCloseMenu()
    this.props.dispatch(restartGame())
  }

  render() {
    const { mistake, difficulty } = this.props
    const { isOpen } = this.state
    let showMistake = mistake >= 3 ? 3 : mistake
    return (
      <View className='game'>
        <View className='sudoku-wrapper'>
          {/* <TopBar /> */}
          <View style={{ flex: 4 }} />
          <View className='game-info-wrapper'>
            <View className='info-wrap diffculty'>
              <View className='info-text'>{difficultyData[difficulty]}</View>
            </View>
            <View className='info-wrap check-mistake'>
              <View className='info-label'>错误:</View>
              <View className='info-text'>{showMistake}/3</View>
            </View>
            <View className='info-wrap time-passed'>
              <Timer />
            </View>
          </View>
          <View className='game-flex-wrapper'>
            <View className='game-wrapper-box'>
              <GameBoard />
            </View>
          </View>
          <View style={{ flex: 2 }} />
          <View className='game-controls'>
            <GameControls />
          </View>
          <View style={{ flex: 1 }} />
          <View className='numpad-wrapper'>
            <NumPad />
          </View>
          <View style={{ flex: 1 }} />
          <View className='ads-wrapper'></View>
          {/* <Hint /> */}
        </View>
        <AtModal isOpened={mistake === 3} closeOnClickOverlay={false}>
          <AtModalContent className='gameover-wrapper'>
            <View className='gameover-title'>游戏结束</View>
            <View className='gameover-desc'>你犯了3个错误，游戏失败</View>
            <View className='gameover-btns'>
              {/* <AtButton className='fill-btn' circle>
                看视频获取第二次机会
              </AtButton> */}
              <AtButton className='new-game' onClick={this.handleOpenMenu}>
                新游戏
              </AtButton>
            </View>
          </AtModalContent>
        </AtModal>
        <GameSheet
          isOpen={isOpen}
          onCloseMenu={this.handleCloseMenu}
          onNewGame={this.handleNewGame}
          onRestartGame={this.handleRestartGame}
        />
      </View>
    )
  }
}

export default Game
