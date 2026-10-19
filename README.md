# token-meter

A Claude Code mod that adds one line above the prompt with the two numbers the built-in UI does not show: **output speed** and **prompt-cache hit rate**.

```
▾ 上一轮  82.4 tok/s  首字 1.3s · 缓存 96%     本会话  75.1 tok/s · 缓存 91% · 23 次请求 · 输出 18.2k
```

- **tok/s**: output tokens ÷ generation time, measured from the first streamed token to the end of each model request. Waiting for the first token and tool execution are not counted. Thinking tokens count as output.
- **首字 (first token)**: time from sending the request to the first streamed token.
- **缓存 (cache hit rate)**: `cache_read ÷ (cache_read + cache_write + uncached input)`. Green ≥ 80%, yellow ≥ 50%, red below.
- **上一轮 / 本轮**: all requests since your last message; updates live while Claude is working.
- **本会话**: running totals for the session; reset by `/clear`.
- Only the main conversation is counted; subagent requests are not.
- Click `▾` to collapse to a single short line, `▸` to expand.

Draws on the terminal and on the Claude desktop app's Code tab.

## Install

At the prompt of a terminal session:

```
/plugin install token-meter --marketplace Ami0307/claude-token-meter
```

From a shell:

```bash
claude plugin install token-meter --marketplace Ami0307/claude-token-meter
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `Ami0307/claude-token-meter`, then **Add plugin**.

Answer `y` to add the marketplace, then pick the user scope so it loads in every session.

## Develop

```bash
claude plugin validate .
claude plugin test .
```

## License

MIT
