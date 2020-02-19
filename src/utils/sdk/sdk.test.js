import * as sdk from './index'
import { transformFromSdkBoard } from '../board'

export default async function test() {
  try {
    console.time('[time] generate')
    const result = await sdk.generate(9, 1)
    console.timeEnd('[time] generate')
    console.info('result:', result)

    console.time('[time] transformFromSdkBoard')
    const userBoard = transformFromSdkBoard(result.board)
    console.timeEnd('[time] transformFromSdkBoard')
    console.info('userBoard:', userBoard)

    console.time('[time] solveStep')
    const nextStep = sdk.solveStep(userBoard)
    console.timeEnd('[time] solveStep')
    console.info('nextStep:', nextStep)
  } catch (error) {
    console.error('error:', error)
  }
}
