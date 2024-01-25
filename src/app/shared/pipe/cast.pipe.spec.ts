import { ActionColumnDef, COLUMN_TYPE } from '../../tickers/model/tickers-table-config'
import { CastPipe } from './cast.pipe'

describe('CastPipe', () => {
  let castPipe: CastPipe

  beforeEach(() => {
    castPipe = new CastPipe()
  })

  it('should cast to a custom type', () => {
    const customObject: unknown = {
      key: 'add',
      title: 'Action',
      headerCellclass: [],
      type: COLUMN_TYPE.ACTION,
      actionCallback: (): void => {},
      actionLabel: 'Add'
    }
    const castedCustomObject: ActionColumnDef = castPipe.transform<ActionColumnDef>(customObject)

    expect(castedCustomObject).toBe(customObject)
  })
})
