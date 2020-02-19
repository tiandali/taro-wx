declare namespace SudokuSdk {
  interface UserCell {
    x: number
    y: number
    v: number
    notes: number[]
  }

  interface SdkGeneratedData {
    answer: number[]
    board: number[]
    difficulty: number
  }

  interface BoardWithNotesData {
    v: number
    notes: number[]
  }

  interface PathInfo {
    id: number
    triggers?: number[] // 触发策略的cells
    cells?: number[] // 发生变化的cells
    num?: number // 填入的数字
    candidates: number[] // 减少的候选数字
    houses: number[] // 高亮的house
    houseType: number[] // 对应相应下标的houses
    highLightCells: number[] // 高亮的 cells
    updatedCandidates: boolean // 是否只是对候选数字的操作
  }

  interface NextStepInfo {
    path: PathInfo[]
    useNotes: boolean
  }

  /**
   * 生成初始化的棋盘
   *
   * @param {number} boardSize 9
   * @param {number} boardDifficulty 1~4
   * @returns {string}
   */
  function generate(
    boardSize: number,
    boardDifficulty: number
  ): SdkGeneratedData

  /**
   * 获取下一部提示
   *
   * @param {BoardWithNotesData[]} boardWithNotesList
   * @returns {NextStepInfo}
   */
  function solveStep(boardWithNotesList: BoardWithNotesData[]): NextStepInfo

  /**
   * 获取棋盘所以候选数
   *
   * @param {BoardWithNotesData[]} boardWithNotesList
   * @returns {number[][]}
   */
  function getCandidates(boardWithNotesList: BoardWithNotesData[]): number[][]
}

export = SudokuSdk
