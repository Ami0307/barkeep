import type { Stats } from '../types'

export type Step = {
  outputTokens: number
  generationMs: number
  firstTokenMs: number
  uncachedInput: number
  cacheRead: number
  cacheWrite: number
}

export const empty = (turnId: string): Stats => ({
  turnId,
  steps: 0,
  outputTokens: 0,
  generationMs: 0,
  firstTokenMs: 0,
  uncachedInput: 0,
  cacheRead: 0,
  cacheWrite: 0,
})

export const add = (s: Stats, step: Step): Stats => ({
  turnId: s.turnId,
  steps: s.steps + 1,
  outputTokens: s.outputTokens + step.outputTokens,
  generationMs: s.generationMs + step.generationMs,
  firstTokenMs: step.firstTokenMs,
  uncachedInput: s.uncachedInput + step.uncachedInput,
  cacheRead: s.cacheRead + step.cacheRead,
  cacheWrite: s.cacheWrite + step.cacheWrite,
})

/** Output tokens per second of generation, or null when nothing was timed. */
export const speed = (s: Stats): number | null =>
  s.generationMs > 0 ? s.outputTokens / (s.generationMs / 1000) : null

/** Share of input tokens the prompt cache served, 0..1, or null with no input. */
export const hitRate = (s: Stats): number | null => {
  const total = s.uncachedInput + s.cacheRead + s.cacheWrite
  return total > 0 ? s.cacheRead / total : null
}

export const fmtSpeed = (v: number | null) =>
  v === null ? '–' : `${v >= 100 ? Math.round(v) : v.toFixed(1)} tok/s`

export const fmtRate = (v: number | null) =>
  v === null ? '–' : `${Math.round(v * 100)}%`

export const fmtSeconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`

export const fmtTokens = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`

export const rateColor = (v: number | null) =>
  v === null ? 'subtle' : v >= 0.8 ? 'success' : v >= 0.5 ? 'warning' : 'error'
