import { getInitials } from './utils'

describe('getInitials', () => {
  it('should return initials for a two-word name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should handle single names', () => {
    expect(getInitials('Alice')).toBe('A')
  })

  it('should handle names with more than two words', () => {
    expect(getInitials('John Fitzgerald Kennedy')).toBe('JF')
  })

  it('should handle extra spaces', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD')
  })

  it('should handle lowercase names', () => {
    expect(getInitials('john doe')).toBe('JD')
  })

  it('should handle empty strings', () => {
    expect(getInitials('')).toBe('')
  })

  it('should handle strings with only spaces', () => {
    expect(getInitials('   ')).toBe('')
  })
})
