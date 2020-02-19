import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import './howtoplay.scss'

const host = 'http://39.97.168.26/sudokustatic/images/game/'
const imgs = {
  p1: host + 'howtoplay_p1.png',
  p2_1: host + 'howtoplay_p2_1.png',
  p2_2: host + 'howtoplay_p2_2.png',
  p3_1: host + 'howtoplay_p3_1.png',
  p3_2: host + 'howtoplay_p3_2.png'
}

class HowToPlay extends Component {
  constructor(props) {
    super(props)
    this.config = {
      navigationBarTitleText: '玩法介绍'
    }
  }

  render() {
    return (
      <View className='howtoplay'>
        <Swiper
          className='howtoplay-wrapper'
          indicatorColor='#D8D8D8'
          indicatorActiveColor='#5067ED'
          indicatorDots
        >
          <SwiperItem>
            <View className='howtoplay-page page-1'>
              <Image src={imgs.p1} className='gameboard-img' />
              <View className='page-1-text'>
                数独谜题开始时是一个已包含一些数字的九宫格，这些数字依据游戏难度而定。
              </View>
              <View className='page-1-text'>
                当1到9每一个数字在9行、列和宫中都只出现一次时，谜题解答完毕。
              </View>
              <View className='page-1-text'>
                研究九宫格，找出合适填进每一个单元格的数字。
              </View>
              <View className='page-1-text'>
                选择一个单元格，然后点击一个数字将其填入。
              </View>
              <View className='page-1-text'>
                启用笔记模式可以添加和移除笔记。
              </View>
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='howtoplay-page page-2'>
              <View className='img-box'>
                <Image src={imgs.p2_1} className='gameboard-img' />
                <View className='tips t1'>选择一个单元格</View>
              </View>
              <View className='img-box'>
                <Image src={imgs.p2_2} className='gamecontrols-img' />
                <View className='tips t2'>点击一个数字即可将其填入</View>
              </View>
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='howtoplay-page page-3'>
              <Image src={imgs.p3_1} className='gameboard-img' />
              <View className='img-box'>
                <Image src={imgs.p3_2} className='gamecontrols-img' />
                <View className='tips t3'>
                  启动“笔记”模式可以添加和移除笔记
                </View>
              </View>
            </View>
          </SwiperItem>
        </Swiper>
      </View>
    )
  }
}

export default HowToPlay
