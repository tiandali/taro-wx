export const formatTimeFromSecond = (s = 0) => {
  return [Math.floor(s / 60), Math.floor(s % 60)]
    .map(i => (i > 9 ? i : '0' + i))
    .join(':')
}

export function getSecondWithBaseAndBefore(before, base = 0) {
  return base + Math.floor((Date.now() - before) / 1000)
}
