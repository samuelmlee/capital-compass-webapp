import { FormatKeyPipe } from './format-key.pipe'

describe('FormatKeyPipe', () => {
  let pipe: FormatKeyPipe

  beforeEach(() => {
    pipe = new FormatKeyPipe()
  })

  it('should format Java property names correctly', () => {
    const result = pipe.transform('volumeWeightedPrice')
    expect(result).toBe('Volume Weighted Price')
  })
})
