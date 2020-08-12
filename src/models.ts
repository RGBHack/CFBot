import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose'

import { MONGO_URI } from './config'

mongoose.connect(MONGO_URI, { useNewUrlParser: true })

export interface dbSchema extends Document {
  '800': Array<any>
  '1200': Array<any>
  '1600': Array<any>
  '2000': Array<any>
  '2400': Array<any>
  '2800': Array<any>
  '3200': Array<any>
}

const StuffSchema = new Schema({
  '800': { type: [Map], required: true },
  '1200': { type: [Map], required: true },
  '1600': { type: [Map], required: true },
  '2000': { type: [Map], required: true },
  '2400': { type: [Map], required: true },
  '3200': { type: [Map], required: true },
})

export const dbModel = mongoose.model<dbSchema>('problems', StuffSchema)
