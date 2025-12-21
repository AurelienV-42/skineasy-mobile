import { describe, it, expect } from 'vitest'
import { colors } from '@theme/colors'

describe('colors', () => {
  it('should have primary color defined', () => {
    expect(colors.primary).toBe('#F7B6A8')
  })

  it('should have background color defined', () => {
    expect(colors.background).toBe('#FFF9F5')
  })

  it('should have all required color keys', () => {
    const requiredKeys = [
      'primary',
      'primaryDark',
      'secondary',
      'background',
      'surface',
      'text',
      'textMuted',
      'error',
      'success',
      'warning',
      'border',
    ]

    requiredKeys.forEach((key) => {
      expect(colors).toHaveProperty(key)
    })
  })
})
