import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import GameStats from './GameStats'
import './stats.scss'

const tabList = [
  { title: '容易' },
  { title: '中等' },
  { title: '困难' },
  { title: '专家' }
]

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
    this.config = {
      navigationBarTitleText: '统计信息'
    }
  }

  handleClick = value => {
    this.setState({
      current: value
    })
  }

  render() {
    const { gameStatsData } = this.props
    const { current } = this.state
    return (
      <View className='stats'>
        <AtTabs
          className='stats-tabs'
          current={current}
          tabList={tabList}
          onClick={this.handleClick}
        >
          <AtTabsPane current={current} index={0}>
            <GameStats data={gameStatsData[1]} />
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <GameStats data={gameStatsData[2]} />
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            <GameStats data={gameStatsData[3]} />
          </AtTabsPane>
          <AtTabsPane current={current} index={3}>
            <GameStats data={gameStatsData[4]} />
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

const mapStateToProps = ({ storageData }) => {
  return {
    gameStatsData: storageData.gameStats
  }
}
export default connect(mapStateToProps)(Stats)
