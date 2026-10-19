export type Lang = 'en' | 'zh'

export type Labels = {
  turn: string
  lastTurn: string
  session: string
  firstToken: string
  cache: string
  requests: (n: number) => string
  output: string
}

export const LABELS: Record<Lang, Labels> = {
  en: {
    turn: 'This turn',
    lastTurn: 'Last turn',
    session: 'Session',
    firstToken: 'TTFT',
    cache: 'cache',
    requests: n => `${n} ${n === 1 ? 'request' : 'requests'}`,
    output: 'out',
  },
  zh: {
    turn: '本轮',
    lastTurn: '上一轮',
    session: '本会话',
    firstToken: '首字',
    cache: '缓存',
    requests: n => `${n} 次请求`,
    output: '输出',
  },
}

/** Maps a locale tag such as `zh-Hans-CN`, `zh_CN.UTF-8` or `en-US` to a label language. */
export const fromLocale = (tag: string | undefined): Lang | undefined => {
  if (tag === undefined || tag.trim() === '' || tag === 'C' || tag === 'POSIX') {
    return undefined
  }
  return tag.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

/** The first entry of `defaults read -g AppleLanguages` output, e.g. `("zh-Hans-CN", "en-US")`. */
export const firstAppleLanguage = (stdout: string): string | undefined =>
  stdout.match(/"?([A-Za-z]{2,3}(?:[-_][A-Za-z0-9]+)*)"?/)?.[1]
