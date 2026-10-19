# tokscope

A Claude Code mod that puts the two numbers the built-in UI leaves out on one line above the prompt: **how fast the model is writing** and **how much of each request the prompt cache served**.

```
▾ Last turn  82.4 tok/s  TTFT 1.3s · cache 96%    Session  75.1 tok/s · cache 91% · 23 requests · out 18.2k
```

## What it shows

- **tok/s**: output tokens divided by generation time. Generation time runs from the first streamed token to the end of each model request, so waiting for the first token and running tools are not counted. Thinking tokens count as output.
- **TTFT**: time to first token, from sending the request to the first streamed token.
- **cache**: the prompt-cache hit rate, `cache_read / (cache_read + cache_write + uncached_input)`, colored green at 80% and above, yellow at 50% and above, red below.
- **Last turn / This turn**: every request since your last message. The numbers update live while Claude is working.
- **Session**: running totals for the session. `/clear` resets them.
- Only requests in the main conversation are counted, not subagents.
- Click `▾` to collapse the band to one short line, and `▸` to expand it again. The band stays hidden until the first request finishes.

It draws in the terminal and in the Code tab of the Claude desktop app.

## Language

Labels follow the system language: Chinese when the system language is Chinese, English otherwise. To pick one yourself, set the plugin's **Language** option to `en` or `zh` in the plugin's settings.

To find the system language, tokscope reads the `LC_ALL`, `LC_MESSAGES` and `LANG` environment variables. When none is set, which is usual for apps started from the macOS Dock, it runs `defaults read -g AppleLanguages` once per session and uses the first language in that list.

## Privacy

tokscope reads only the token counts and timings Claude Code reports for each model request. It keeps them in memory for the current session, sends nothing over the network, and writes no files. Apart from the `defaults` command above, it runs no programs.

## Install

At the prompt of a terminal session:

```
/plugin install tokscope --marketplace Ami0307/tokscope
```

From a shell:

```bash
claude plugin install tokscope --marketplace Ami0307/tokscope
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, then **Add marketplace** with `Ami0307/tokscope`, then **Add plugin**.

Answer `y` to add the marketplace, then choose the user scope so the band appears in every session.

## Develop

```bash
claude plugin validate .
claude plugin test .
```

## License

MIT
