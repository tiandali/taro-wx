import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { formatTimeFromSecond } from '../../utils/time'
import pngGames from '../../images/stats_games.png'
import pngTime from '../../images/stats_time.png'
import pngStreak from '../../images/stats_streak.png'
import './gamestats.scss'

export default function GameStats({ data = {} }) {
  const {
    total = 0,
    win = 0,
    winNoMistake = 0,
    bestTime = 0,
    totalWinTime = 0,
    streak = 0,
    longStreak = 0
  } = data
  let avgWinTime = 0
  if (totalWinTime && win) {
    const avgSeconds = Number((totalWinTime / win).toFixed(0))
    avgWinTime = formatTimeFromSecond(avgSeconds)
  }
  return (
    <View className='game-stats-wrapper'>
      <View className='game-stats-option'>
        <View className='game-stats-title'>
          <Image className='game-stats-icon' src={pngGames} />
          游戏
        </View>
        <View className='game-stats-content'>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>游戏局数</View>
            <View className='game-stats-item-right'>{total}</View>
          </View>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>获胜局数</View>
            <View className='game-stats-item-right'>{win}</View>
          </View>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>胜率</View>
            <View className='game-stats-item-right'>
              {total ? ((win / total) * 100).toFixed(0) : 0}%
            </View>
          </View>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>零失误获胜</View>
            <View className='game-stats-item-right'>{winNoMistake}</View>
          </View>
        </View>
      </View>
      <View className='game-stats-option'>
        <View className='game-stats-title'>
          <Image className='game-stats-icon' src={pngTime} />
          时间
        </View>
        <View className='game-stats-content'>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>最快时间</View>
            <View className='game-stats-item-right'>
              {bestTime ? formatTimeFromSecond(bestTime) : '--:--'}
            </View>
          </View>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>平均时间</View>
            <View className='game-stats-item-right'>
              {avgWinTime ? avgWinTime : '--:--'}
            </View>
          </View>
        </View>
      </View>
      <View className='game-stats-option'>
        <View className='game-stats-title'>
          <Image className='game-stats-icon' src={pngStreak} />
          连胜
        </View>
        <View className='game-stats-content'>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>当前连胜</View>
            <View className='game-stats-item-right'>{streak}</View>
          </View>
          <View className='game-stats-item'>
            <View className='game-stats-item-left'>最长连胜</View>
            <View className='game-stats-item-right'>{longStreak}</View>
          </View>
        </View>
      </View>
    </View>
  )
}
