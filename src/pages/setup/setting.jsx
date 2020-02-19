import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtSwitch } from 'taro-ui'
import { getUri, routePaths } from '../../routes'
import { getOffSound, setOffSound } from '../../utils/storage'
import iconSound from '../../images/icon_sound.svg'
import iconHowplay from '../../images/icon_howplay.svg'
import iconArrow from '../../images/icon_arrow_right.svg'
import './setting.scss'

class Setting extends Component {
  constructor(props) {
    super(props)
    const ifOff = getOffSound()
    this.state = {
      soundSwitch: !ifOff
    }
    this.config = {
      navigationBarTitleText: '设置'
    }
  }

  handleSound = value => {
    if (value) {
      setOffSound('0')
      this.setState({ soundSwitch: true })
    } else {
      setOffSound('1')
      this.setState({ soundSwitch: false })
    }
  }

  gotoHowToPlay = () => {
    Taro.navigateTo({
      url: getUri(routePaths.howtoplay)
    })
  }

  render() {
    const { soundSwitch } = this.state
    return (
      <View className='setting'>
        <View className='setting-option'>
          <View className='setting-option-inner'>
            <View className='setting-label'>
              <Image className='setting-icon' src={iconSound} />
              音效
            </View>
            <AtSwitch
              className='sound-effects'
              color='#5067ed'
              checked={soundSwitch}
              onChange={this.handleSound}
            />
          </View>
        </View>
        <View className='setting-option' onClick={this.gotoHowToPlay}>
          <View className='setting-option-inner'>
            <View className='setting-label'>
              <Image className='setting-icon' src={iconHowplay} />
              玩法介绍
            </View>
            <Image className='setting-icon-arrow' src={iconArrow} />
          </View>
        </View>
      </View>
    )
  }
}

export default Setting
