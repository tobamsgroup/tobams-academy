import { formatDuration } from './format-duration'

describe('formatDuration', () => {
  it.each([
    [0, '0 mins'],
    [59, '0 mins'],
    [60, '1 min'],
    [45 * 60, '45 mins'],
    [65 * 60, '1h 5m'],
    [12 * 3600, '12h'],
  ])('%i seconds → %s', (seconds, label) => expect(formatDuration(seconds)).toBe(label))
})
