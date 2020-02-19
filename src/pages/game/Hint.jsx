import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './styles/hint.scss'

class Hint extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View className='hint-wrapper'>
        <View className='hint-box'>
          <View className='hint-title'>标题</View>
          <View className='hint-desc'>描述</View>
          <View className='hint-btn-box'>
            <View className='hint-btn back'>上一步</View>
            <View className='hint-btn next'>下一步</View>
          </View>
        </View>
      </View>
    )
  }
}

export default Hint
