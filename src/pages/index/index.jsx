import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import { getUri, routePaths } from '../../routes'
import { newGame, restartGame } from '../../actions/game'
import { storageGameOver } from '../../actions/storageData'
import GameSheet from '../../components/GameSheet'
import { formatTimeFromSecond } from '../../utils/time'
import { difficultyData } from '../../config/gameConfig'
// import imageMainCup from '../../images/main-cup.png'
import { audioPlay, audioTypes } from '../../utils/audio'
import TopBar from '../../components/TopBar'
import './index.scss'

class Index extends Component {
  constructor(props) {
    super(props)
    this.config = {
      navigationBarTitleText: '数独玩玩乐'
    }
    this.state = {
      isOpen: false
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(this.props, nextProps)
  // }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage() {
    return {
      title: '我发现一个简单好玩的数独小程序，是高手就来挑战吧！',
      path: '/pages/index/index?share=index',
      imageUrl: 'http://39.97.168.26/sudokustatic/images/game/index_share.png'
    }
  }

  gotoGame = () => {
    Taro.redirectTo({
      url: getUri(routePaths.game, { new: 1 })
    })
  }

  handleOpenMenu = () => {
    audioPlay(audioTypes.click)
    this.setState({ isOpen: true })
  }
  handleCloseMenu = () => {
    this.setState({ isOpen: false })
  }

  // dailyGotoGame = () => {
  //   Taro.navigateTo({
  //     url: getUri(routePaths.game, { daily_play: 1 })
  //   })
  //   this.handleCloseMenu()
  // }

  handleNewGame = difficulty => {
    setTimeout(() => {
      this.handleCloseMenu()
    }, 500)
    if (this.props.continueGame) {
      this.props.dispatch(storageGameOver())
    }
    this.props.dispatch(newGame(difficulty))
    Taro.redirectTo({
      url: getUri(routePaths.game)
    })
  }

  handleContinue = () => {
    Taro.redirectTo({
      url: getUri(routePaths.game)
    })
  }

  handleRestartGame = () => {
    setTimeout(() => {
      this.handleCloseMenu()
    }, 500)
    this.props.dispatch(storageGameOver())
    this.props.dispatch(restartGame())
    Taro.redirectTo({
      url: getUri(routePaths.game)
    })
  }

  render() {
    const { continueGame, difficulty, time } = this.props
    const { isOpen } = this.state
    return (
      <View className='index'>
        <TopBar />
        {/* <View className='main-top'>
          <View style={{ flex: 1.2 }} />
          <Image className='main-top-img' src={imageMainCup} />
          <View className='main-top-txt'>每日挑战</View>
          <View className='main-top-date'>1月9日</View>
          <AtButton
            className='main-top-play'
            circle
            onClick={this.dailyGotoGame}
          >
            开始
          </AtButton>
          <View style={{ flex: 1 }} />
        </View> */}
        <View className='main-middle'>数独玩玩乐</View>
        <View className='main-bottom'>
          {continueGame ? (
            <View>
              <AtButton
                className='fill-btn continue-btn'
                circle
                onClick={this.handleContinue}
              >
                <View className='continue-btn-txt'>
                  <View className='continue-btn-title'>继续游戏</View>
                  <View className='continue-btn-desc'>
                    {time} - {difficultyData[difficulty]}
                  </View>
                </View>
              </AtButton>
            </View>
          ) : null}
          <AtButton
            className={`${continueGame ? 'default-btn' : 'fill-btn'} `}
            circle
            onClick={this.handleOpenMenu}
          >
            新游戏
          </AtButton>
        </View>
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

const mapStateToProps = ({ game, time }) => {
  let continueGame = false
  const { userBoard = [], result } = game
  if (userBoard.length) {
    continueGame = true
  }
  return {
    continueGame,
    difficulty: result.difficulty,
    time: formatTimeFromSecond(time.base)
  }
}
export default connect(mapStateToProps)(Index)
