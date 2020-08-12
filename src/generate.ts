import * as codeforces from 'codeforces-api'
import { warn, fail } from './logger'
import { dbModel } from './models'

export const genSchema = (): void => {
  codeforces.problemset.problems({}, (err, data) => {
    if (err) {
      warn('Failed to fetch problems from CodeForces')
      return
    }

    const schema = {
      '800': [],
      '1200': [],
      '1600': [],
      '2000': [],
      '2400': [],
      '2800': [],
      '3200': [],
    }

    Object.keys(schema).forEach((el) => {
      schema[el] = data.problems.filter((pr) => {
        return 100 >= Math.abs(parseInt(el) - pr.rating)
      })
    })

    updateDB(schema)
  })
}

export const updateDB = (schema: any): void => {
  dbModel.create(schema, (err) => {
    if (err) {
      fail(err)
    }
  })
}
