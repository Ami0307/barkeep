import { expect, test } from 'claude-code/testing'

import { add, empty, fmtRate, fmtSpeed, hitRate, rateColor, speed } from '../hooks/stats'

const step = {
  outputTokens: 400,
  generationMs: 5000,
  firstTokenMs: 1200,
  uncachedInput: 10,
  cacheRead: 900,
  cacheWrite: 90,
}

test('speed and hit rate add up across steps', async () => {
  const s = add(add(empty('t1'), step), step)
  expect(s.steps).toBe(2)
  expect(speed(s)).toBe(80)
  expect(hitRate(s)).toBe(0.9)
  expect(fmtSpeed(speed(s))).toBe('80.0 tok/s')
  expect(fmtRate(hitRate(s))).toBe('90%')
  expect(rateColor(hitRate(s))).toBe('success')
  expect(fmtSpeed(speed(empty('')))).toBe('–')
  expect(hitRate(empty(''))).toBe(null)
})

test('before any request the band stays out of the way', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box key="engine" />
  })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'token-meter', surface, component: 'AbovePrompt', props: { hasSurvey: false, isWorking: false, maxRows: 10 } as never })
    expect(await ui.find({ type: 'Text', text: /tok\/s/ })).toBeUndefined()
    await ui.unmount()
  }
})
