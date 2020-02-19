import Taro from '@tarojs/taro'
import audioData from '../config/audio'
import { getOffSound } from '../utils/storage'

export const audioTypes = {
  click: 'click',
  mistake: 'mistake',
  right: 'right',
  undo: 'undo',
  erase: 'erase',
  invalid: 'invalid',
  noteSwitch: 'noteSwitch',
  noteInput: 'noteInput',
  doneGame: 'doneGame',
  success: 'success'
}
export const audioPlay = type => {
  const offSound = getOffSound()
  if (offSound) {
    return
  }
  const innerAudioContext = Taro.createInnerAudioContext()
  innerAudioContext.autoplay = true
  innerAudioContext.src = audioData[type]
  innerAudioContext.onEnded(() => {
    innerAudioContext.destroy()
  })
}
