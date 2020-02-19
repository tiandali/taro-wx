import { stringify } from 'query-string'

export const routePaths = {
  index: '/pages/index/index',
  game: '/pages/game/game',
  success: '/pages/success/success',
  setting: '/pages/setup/setting',
  howtoplay: '/pages/setup/howtoplay',
  stats: '/pages/stats/stats'
}

export const getUri = (path = '', query = {}) => `${path}?${stringify(query)}`
