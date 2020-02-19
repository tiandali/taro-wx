import Taro from '@tarojs/taro'

import { apiHost, apiPrefix } from '../config/app'

export const request = ({ url, data, header, ...opts } = {}) =>
  Taro.request({
    url: apiHost + apiPrefix + url,
    data,
    header: {
      'content-type': 'application/json',
      ...header
    },
    ...opts
  })

/**
 * 从服务端拉取新的游戏数据
 *
 * @export
 * @param {*} size
 * @param {*} difficulty
 * @param {*} lastIndex
 * @returns
 */
export function getMoreGames(size, difficulty, lastIndex) {
  return request({
    url: '/moregames',
    data: {
      size,
      difficulty,
      lastIndex
    }
  }).then(r => r.data)
}
