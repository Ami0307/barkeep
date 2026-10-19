import { expect, test } from 'claude-code/testing'

import { firstAppleLanguage, fromLocale, LABELS } from '../hooks/i18n'
import { add, empty, fmtRate, fmtSpeed, hitRate, rateColor, speed } from '../hooks/stats'

const step = {
  outputTokens: 400,
  generationMs: 5000,
  firstTokenMs: 1200,
  uncachedInput: 10,
  cacheRead: 900,
  cacheWrite: 90,
}

const BAND = { component: 'AbovePrompt', props: { hasSurvey: false, isWorking: false, maxRows: 10 } as never } as const

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

test('labels follow the system language', async () => {
  expect(fromLocale('zh_CN.UTF-8')).toBe('zh-Hans')
  expect(fromLocale('zh-Hans-CN')).toBe('zh-Hans')
  expect(fromLocale('zh-Hant-TW')).toBe('zh-Hant')
  expect(fromLocale('zh_HK.UTF-8')).toBe('zh-Hant')
  expect(fromLocale('en_US.UTF-8')).toBe('en')
  expect(fromLocale('ja-JP')).toBe('ja')
  expect(fromLocale('pt-BR')).toBe('pt')
  expect(fromLocale('de_DE.UTF-8')).toBe('de')
  expect(fromLocale('nl-NL')).toBe('en')
  expect(fromLocale('C')).toBe(undefined)
  expect(fromLocale('')).toBe(undefined)
  expect(firstAppleLanguage('(\n    "zh-Hans-CN",\n    "en-US"\n)\n')).toBe('zh-Hans-CN')
  expect(firstAppleLanguage('(\n    en,\n    fr\n)\n')).toBe('en')
  expect(LABELS.en.requests(1)).toBe('1 request')
  expect(LABELS.en.requests(3)).toBe('3 requests')
  expect(LABELS.ru.requests(1)).toBe('1 запрос')
  expect(LABELS.ru.requests(3)).toBe('3 запроса')
  expect(LABELS.ru.requests(12)).toBe('12 запросов')
  expect(LABELS.ru.requests(21)).toBe('21 запрос')
})

test('before any request the band stays out of the way', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box key="engine" />
  })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'barkeep', surface, ...BAND })
    expect(await ui.find({ type: 'Text', text: /tok\/s/ })).toBeUndefined()
    await ui.unmount()
  }
})
