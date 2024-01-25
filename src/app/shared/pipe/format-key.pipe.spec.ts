import { FormatKeyPipe } from './format-key.pipe'

describe('FormatKeyPipe', () => {
  let pipe: FormatKeyPipe

  beforeEach(() => {
    pipe = new FormatKeyPipe()
  })

  it('should format camel case names correctly', () => {
    const result = pipe.transform('volumeWeightedPrice')
    expect(result).toBe('Volume Weighted Price')
  })
})
