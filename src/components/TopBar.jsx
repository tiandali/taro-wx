import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { getUri, routePaths } from '../routes'
import { audioPlay, audioTypes } from '../utils/audio'
import iconSetting from '../images/icon_setting.svg'
import './styles/topbar.scss'

const gotoSetting = () => {
  audioPlay(audioTypes.click)
  Taro.navigateTo({
    url: getUri(routePaths.setting)
  })
}
export default function Topbar() {
  return (
    <View className='topbar'>
      <View
        className='topbar-iconbox'
        onClick={() => {
          gotoSetting()
        }}
      >
        <Image className='topbar-icon setting' src={iconSetting} />
      </View>
    </View>
  )
}
