export const LANGS = ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'it', 'ru'] as const

export type Lang = (typeof LANGS)[number]

export type Labels = {
  turn: string
  lastTurn: string
  session: string
  firstToken: string
  cache: string
  requests: (n: number) => string
  output: string
  waiting: string
}

const russianRequests = (n: number) => {
  const tens = n % 100
  const ones = n % 10
  if (tens >= 11 && tens <= 14) return `${n} запросов`
  if (ones === 1) return `${n} запрос`
  if (ones >= 2 && ones <= 4) return `${n} запроса`
  return `${n} запросов`
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
    waiting: 'waiting for the first request',
  },
  'zh-Hans': {
    turn: '本轮',
    lastTurn: '上一轮',
    session: '本会话',
    firstToken: '首字',
    cache: '缓存',
    requests: n => `${n} 次请求`,
    output: '输出',
    waiting: '等待第一次请求',
  },
  'zh-Hant': {
    turn: '本輪',
    lastTurn: '上一輪',
    session: '本工作階段',
    firstToken: '首字',
    cache: '快取',
    requests: n => `${n} 次請求`,
    output: '輸出',
    waiting: '等待第一次請求',
  },
  ja: {
    turn: '今回',
    lastTurn: '前回',
    session: 'セッション',
    firstToken: '初回応答',
    cache: 'キャッシュ',
    requests: n => `${n} 件のリクエスト`,
    output: '出力',
    waiting: '最初のリクエストを待っています',
  },
  ko: {
    turn: '이번 턴',
    lastTurn: '지난 턴',
    session: '세션',
    firstToken: '첫 토큰',
    cache: '캐시',
    requests: n => `요청 ${n}회`,
    output: '출력',
    waiting: '첫 요청을 기다리는 중',
  },
  es: {
    turn: 'Este turno',
    lastTurn: 'Último turno',
    session: 'Sesión',
    firstToken: '1.er token',
    cache: 'caché',
    requests: n => `${n} ${n === 1 ? 'solicitud' : 'solicitudes'}`,
    output: 'salida',
    waiting: 'esperando la primera solicitud',
  },
  fr: {
    turn: 'Ce tour',
    lastTurn: 'Dernier tour',
    session: 'Session',
    firstToken: '1er jeton',
    cache: 'cache',
    requests: n => `${n} ${n <= 1 ? 'requête' : 'requêtes'}`,
    output: 'sortie',
    waiting: 'en attente de la première requête',
  },
  de: {
    turn: 'Diese Runde',
    lastTurn: 'Letzte Runde',
    session: 'Sitzung',
    firstToken: 'Erstes Token',
    cache: 'Cache',
    requests: n => `${n} ${n === 1 ? 'Anfrage' : 'Anfragen'}`,
    output: 'Ausgabe',
    waiting: 'warte auf die erste Anfrage',
  },
  pt: {
    turn: 'Este turno',
    lastTurn: 'Último turno',
    session: 'Sessão',
    firstToken: '1º token',
    cache: 'cache',
    requests: n => `${n} ${n === 1 ? 'solicitação' : 'solicitações'}`,
    output: 'saída',
    waiting: 'aguardando a primeira solicitação',
  },
  it: {
    turn: 'Questo turno',
    lastTurn: 'Ultimo turno',
    session: 'Sessione',
    firstToken: '1º token',
    cache: 'cache',
    requests: n => `${n} ${n === 1 ? 'richiesta' : 'richieste'}`,
    output: 'output',
    waiting: 'in attesa della prima richiesta',
  },
  ru: {
    turn: 'Этот ход',
    lastTurn: 'Прошлый ход',
    session: 'Сеанс',
    firstToken: 'Первый токен',
    cache: 'кэш',
    requests: russianRequests,
    output: 'вывод',
    waiting: 'ожидание первого запроса',
  },
}

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANGS as readonly string[]).includes(v)

/**
 * Maps a locale tag such as `zh-Hans-CN`, `zh_TW.UTF-8`, `pt-BR` or `en-US` to a label
 * language: undefined for no locale (`C`, `POSIX`, empty), English for one with no labels.
 */
export const fromLocale = (tag: string | undefined): Lang | undefined => {
  const t = tag?.trim().split('.')[0]?.replace(/_/g, '-').toLowerCase()
  if (t === undefined || t === '' || t === 'c' || t === 'posix') {
    return undefined
  }
  const parts = t.split('-')
  const base = parts[0]
  if (base === 'zh') {
    const traditional = parts.some(p => p === 'hant' || p === 'tw' || p === 'hk' || p === 'mo')
    return traditional ? 'zh-Hant' : 'zh-Hans'
  }
  return isLang(base) ? base : 'en'
}

/** The first entry of `defaults read -g AppleLanguages` output, e.g. `("zh-Hans-CN", "en-US")`. */
export const firstAppleLanguage = (stdout: string): string | undefined =>
  stdout.match(/"?([A-Za-z]{2,3}(?:[-_][A-Za-z0-9]+)*)"?/)?.[1]
