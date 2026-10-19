export type Stats = {
  /** The turn these figures count; '' for the session's running totals. */
  turnId: string
  steps: number
  outputTokens: number
  /** Milliseconds from each step's first streamed chunk to its end, summed. */
  generationMs: number
  /** Time to first token of the latest step, in milliseconds. */
  firstTokenMs: number
  uncachedInput: number
  cacheRead: number
  cacheWrite: number
}

declare module 'claude-code' {
  interface PluginState {
    'token-meter': { turn: Stats | null; session: Stats | null; isCollapsed: boolean }
  }
}
