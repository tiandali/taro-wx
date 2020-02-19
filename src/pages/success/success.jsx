import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import GameSheet from '../../components/GameSheet'
import { newGame, restartGame } from '../../actions/game'
import { difficultyData } from '../../config/gameConfig'
import { getUri, routePaths } from '../../routes'
import { formatTimeFromSecond } from '../../utils/time'

import successPng from '../../images/success.png'
import iconDifficulty from '../../images/icon_difficulty.svg'
import iconTime from '../../images/icon_time.svg'
import iconBestTime from '../../images/icon_best_time.svg'
import iconMain from '../../images/icon_mainpage.svg'
import iconShare from '../../images/icon_share.svg'
import { audioPlay, audioTypes } from '../../utils/audio'

import './success.scss'

class Success extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.config = {
      navigationBarTitleText: ''
    }
  }

  componentDidMount() {
    audioPlay(audioTypes.success)
  }

  componentWillUnmount() {
    if (this.props.gameSuccess) {
      this.props.dispatch({ type: 'game_clearGame' })
    }
  }

  onShareAppMessage() {
    return {
      title: '我发现一个简单好玩的数独小程序，是高手就来挑战吧！',
      path: '/pages/index/index?share=success'
    }
  }

  handleOpenMenu = () => {
    this.setState({ isOpen: true })
  }
  handleCloseMenu = () => {
    this.setState({ isOpen: false })
  }

  handleNewGame = difficulty => {
    setTimeout(() => {
      this.handleCloseMenu()
    }, 500)
    this.props.dispatch(newGame(difficulty))
    Taro.redirectTo({
      url: getUri(routePaths.game)
    })
  }

  handleRestartGame = () => {
    setTimeout(() => {
      this.handleCloseMenu()
    }, 500)
    this.props.dispatch(restartGame())
    Taro.redirectTo({
      url: getUri(routePaths.game)
    })
  }

  handleGoMain = () => {
    Taro.reLaunch({
      url: getUri(routePaths.index)
    })
  }

  render() {
    const { difficulty, doneTime, bestTime } = this.props
    const { isOpen } = this.state
    let showBestTime = doneTime
    if (bestTime) {
      showBestTime = bestTime
    }
    return (
      <View className='success-wrapper'>
        <View style={{ flex: 1 }} />
        <View className='success-top'>
          <Image className='success-img' src={successPng} />
        </View>
        <View style={{ flex: 3 }} />
        <View className='success-middle'>
          <View className='success-middle-list'>
            <View className='success-middle-left'>
              <Image className='success-icon' src={iconDifficulty} />
              <View className='success-label'>难度</View>
            </View>
            <View className='success-middle-right'>
              {difficultyData[difficulty || 1]}
            </View>
          </View>
          <View className='success-middle-list'>
            <View className='success-middle-left'>
              <Image className='success-icon' src={iconTime} />
              <View className='success-label'>时间</View>
            </View>
            <View className='success-middle-right'>
              {formatTimeFromSecond(doneTime)}
            </View>
          </View>
          <View className='success-middle-list'>
            <View className='success-middle-left'>
              <Image className='success-icon' src={iconBestTime} />
              <View className='success-label'>最快时间</View>
            </View>
            <View className='success-middle-right'>
              {formatTimeFromSecond(showBestTime)}
            </View>
          </View>
        </View>
        <View style={{ flex: 5 }} />
        <View className='success-bottom'>
          <AtButton className='fill-btn' onClick={this.handleOpenMenu}>
            新游戏
          </AtButton>
          <View className='success-bottom-actions'>
            <View className='main-btn-box'>
              <AtButton
                className='success-bottom-btn'
                onClick={this.handleGoMain}
              >
                <View className='btn-inner'>
                  <Image className='success-icon' src={iconMain} />
                  <View className='success-bottom-label'>首页</View>
                </View>
              </AtButton>
            </View>
            <AtButton className='success-bottom-btn' openType='share'>
              <View className='btn-inner'>
                <Image className='success-icon' src={iconShare} />
                <View className='success-bottom-label'>分享</View>
              </View>
            </AtButton>
          </View>
        </View>
        <View style={{ flex: 2 }} />
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
const mapStateToProps = ({ game, time, storageData }) => {
  const { gameSuccess } = game
  const { difficulty } = game.result
  const gameData = storageData.gameStats[difficulty] || {}
  const { bestTime = 0 } = gameData
  return {
    gameSuccess,
    difficulty,
    doneTime: time.base,
    bestTime: bestTime
  }
}
export default connect(mapStateToProps)(Success)
