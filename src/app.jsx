import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'
import './app.scss'

import { updateGameStats } from '../src/actions/storageData'
import { initUndoneGame } from '../src/actions/game'
import { initUndoneTime } from '../src/actions/time'
import {
  getGameStats,
  setUndoneGame,
  getUndoneGame
} from '../src/utils/storage'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {
  // componentDidMount() {}
  // componentDidShow() {}
  // componentDidHide() {}
  // componentDidCatchError() {}
  componentDidMount() {
    // 跟随iOS的静音模式
    // wx.setInnerAudioOption({ obeyMuteSwitch: false })
    const gameStats = getGameStats()
    store.dispatch(updateGameStats(gameStats))
    const undoneData = getUndoneGame()
    const { game, time } = undoneData
    if (game) {
      store.dispatch(initUndoneGame(game))
      store.dispatch(initUndoneTime(time.base))
    }
  }

  componentDidHide() {
    const { game, time } = store.getState()
    const { result, userBoard, mistake, notesGrid, gameSuccess } = game
    const { base } = time
    if (mistake < 3 && !gameSuccess) {
      setUndoneGame({
        game: { result, userBoard, mistake, notesGrid },
        time: { base }
      })
    }
  }

  config = {
    pages: [
      'pages/index/index',
      'pages/game/game',
      'pages/success/success',
      'pages/setup/setting',
      'pages/setup/howtoplay',
      'pages/stats/stats'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#9B9B9B',
      selectedColor: '#5067ed',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '主页',
          iconPath: '/static/images/mainpage.png',
          selectedIconPath: '/static/images/mainpage_selected.png'
        },
        {
          pagePath: 'pages/stats/stats',
          text: '统计信息',
          iconPath: '/static/images/statspage.png',
          selectedIconPath: '/static/images/statspage_selected.png'
        }
      ]
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
