export interface problemArray {
  contestId: number
  index: string
  points: number
  origPoints: number
  toString: () => string
  problem: any
}

export interface userScore {
  handle: string
  score: number
}
