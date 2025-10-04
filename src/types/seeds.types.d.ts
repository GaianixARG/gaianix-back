import { ESeed } from './enums'

export interface ISeed {
  id: string
  name: string
  type: ESeed
  provider: string
}
