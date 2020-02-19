/* eslint-disable import/no-commonjs */
import fs from 'fs'
import path from 'path'
import puzzles from './data/puzzles.json'
import * as helper from '../src/utils/board'

const toJs = str => `module.exports='${str}'`

const writeToFile = (file, data) => {
  try {
    fs.writeFileSync(file, data)
  } catch (err) {
    console.error('Add failed!')
  }
}

const splitFile = () => {
  const fileData = {
    '2': [],
    '3': [],
    '4': []
  }
  for (let i = 0; i < puzzles.length; i++) {
    const ele = puzzles[i]
    const difficulty = ele.difficulty + 1
    const str = helper.toString({
      board: ele.question,
      answer: ele.solution,
      difficulty
    })

    fileData[difficulty].push(str)
  }

  console.log('len 2: ', fileData['2'].length)
  console.log('len 3: ', fileData['3'].length)
  console.log('len 4: ', fileData['4'].length)

  writeToFile(path.join(__dirname, 'data', '2.all.js'), toJs(fileData['2'].slice(1000)))
  writeToFile(path.join(__dirname, 'data', '3.all.js'), toJs(fileData['3'].slice(1000)))
  writeToFile(path.join(__dirname, 'data', '4.all.js'), toJs(fileData['4'].slice(1000)))

  writeToFile(
    path.join(__dirname, '../src/data', '2-1000.js'),
    toJs(fileData['2'].slice(0, 1000))
  )
  writeToFile(
    path.join(__dirname, '../src/data', '3-1000.js'),
    toJs(fileData['3'].slice(0, 1000))
  )
  writeToFile(
    path.join(__dirname, '../src/data', '4-1000.js'),
    toJs(fileData['4'].slice(0, 1000))
  )
}

splitFile()
