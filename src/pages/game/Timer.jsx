import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { switchPause } from '../../actions/game'
import { targetPause } from '../../actions/time'
import {
  getSecondWithBaseAndBefore,
  formatTimeFromSecond
} from '../../utils/time'

import iconPause from '../../images/icon_pause.svg'
import iconPlay from '../../images/icon_play.svg'

import './styles/timer.scss'

const _INTERVAL_TIME_ = 1000

@connect(({ time, game }) => ({
  ...time,
  // pauseGame: game.pauseGame,
  pauseTimer: game.pauseTimer,
  mistake: game.mistake,
  gameSuccess: game.gameSuccess
}))
class Timer extends Component {
  constructor(props) {
    super(props)
    let timer = '00:00'
    if (props.base) {
      timer = formatTimeFromSecond(props.base)
    }
    this.state = {
      timer
    }
  }

  componentDidMount() {
    if (this.props.base) {
      this.startTimer()
      this.props.dispatch(targetPause(true))
    } else {
      this.targetTimer(this.props.pauseTimer)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pauseTimer !== this.props.pauseTimer) {
      this.targetTimer(this.props.pauseTimer)
    }
  }

  componentWillUnmount() {
    this.cleanTimer()
    if (!this.props.gameSuccess && !this.props.pauseTimer) {
      this.props.dispatch(targetPause(false))
    }
  }

  updateTime = () => {
    const { base, lastStart, pauseTimer } = this.props
    if (!pauseTimer) {
      this.setState({
        timer: formatTimeFromSecond(getSecondWithBaseAndBefore(lastStart, base))
      })
    }
  }

  cleanTimer = () => this.timer && clearInterval(this.timer)

  startTimer = () => {
    this.cleanTimer()
    this.timer = setInterval(this.updateTime, _INTERVAL_TIME_)
  }

  targetTimer = pause => {
    if (pause) {
      this.cleanTimer()
    } else {
      this.startTimer()
    }
  }

  handlePause = () => {
    const { dispatch } = this.props
    dispatch(switchPause())
  }

  render() {
    const { pauseTimer } = this.props
    const { timer } = this.state
    return (
      <View className='timer-wrap' onClick={this.handlePause}>
        <View className='timer'>{timer}</View>
        <Image
          className={`time-icon ${pauseTimer ? 'play' : ''}`}
          src={pauseTimer ? iconPlay : iconPause}
        />
      </View>
    )
  }
}

export default Timer
