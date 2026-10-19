import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { add, empty, fmtRate, fmtSeconds, fmtSpeed, fmtTokens, hitRate, rateColor, speed } from './stats'

const turn = atom({ plugin: 'token-meter', key: 'turn' } as const, null)
const session = atom({ plugin: 'token-meter', key: 'session' } as const, null)
const isCollapsed = atom({ plugin: 'token-meter', key: 'isCollapsed' } as const, false)

export const register: Register = on => {
  // Time each main-loop model request: first streamed chunk to end is generation.
  on('turn.step', async function* ($, e, next) {
    if (e.agentId !== undefined) {
      return yield* next(e)
    }

    const startedAt = await $.clock.now()
    let firstAt: number | undefined
    const stream = next(e)

    for await (const chunk of stream) {
      if (firstAt === undefined && (chunk.kind === 'text' || chunk.kind === 'thinking' || chunk.kind === 'tool')) {
        firstAt = await $.clock.now()
      }
      yield chunk
    }

    const result = await stream.result
    const endedAt = await $.clock.now()
    const usage = result.usage

    if (usage !== null) {
      const step = {
        outputTokens: usage.output_tokens,
        generationMs: firstAt === undefined ? 0 : endedAt - firstAt,
        firstTokenMs: (firstAt ?? endedAt) - startedAt,
        uncachedInput: usage.input_tokens,
        cacheRead: usage.cache_read_input_tokens,
        cacheWrite: usage.cache_creation_input_tokens,
      }
      await update($, turn, t => add(t !== null && t.turnId === e.turnId ? t : empty(e.turnId), step))
      await update($, session, s => add(s ?? empty(''), step))
    }

    return result
  })

  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      await update($, turn, () => null)
      await update($, session, () => null)
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const t = await read($, turn)
    const s = await read($, session)

    if (e.props.hasSurvey || t === null || s === null) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const tRate = hitRate(t)
    const sRate = hitRate(s)
    const label = e.props.isWorking ? '本轮' : '上一轮'

    if (await read($, isCollapsed)) {
      return (
        <Box flexDirection="row" columnGap={1} alignItems="center">
          <Button key="toggle" label="▸" plain dimColor onPress={() => update($, isCollapsed, () => false)} />
          <Text dimColor>{label}</Text>
          <Text bold tabular>{fmtSpeed(speed(t))}</Text>
          <Text dimColor>·</Text>
          <Text bold tabular color={rateColor(tRate)}>{fmtRate(tRate)}</Text>
        </Box>
      )
    }

    return (
      <Box flexDirection="row" columnGap={1} alignItems="flex-start">
        <Button key="toggle" label="▾" plain dimColor onPress={() => update($, isCollapsed, () => true)} />
        <Box flexDirection="row" flexWrap="wrap" columnGap={2} flexShrink={1}>
          <Box flexDirection="row" columnGap={1}>
            <Text dimColor>{label}</Text>
            <Text bold tabular>{fmtSpeed(speed(t))}</Text>
            <Text dimColor tabular>首字 {fmtSeconds(t.firstTokenMs)}</Text>
            <Text dimColor>·</Text>
            <Text dimColor>缓存</Text>
            <Text bold tabular color={rateColor(tRate)}>{fmtRate(tRate)}</Text>
          </Box>
          <Box flexDirection="row" columnGap={1}>
            <Text dimColor>本会话</Text>
            <Text tabular>{fmtSpeed(speed(s))}</Text>
            <Text dimColor>·</Text>
            <Text dimColor>缓存</Text>
            <Text tabular color={rateColor(sRate)}>{fmtRate(sRate)}</Text>
            <Text dimColor tabular>· {s.steps} 次请求 · 输出 {fmtTokens(s.outputTokens)}</Text>
          </Box>
        </Box>
      </Box>
    )
  })
}
