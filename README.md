# Calcifer

Discord bot with Calcifer's personality from *Howl's Moving Castle*: prefix & slash commands, Groq-powered AI, configurable response language, and TypeScript on Bun.

## Features

- **Calcifer persona** — Responds in character; extra kind to Sophie, familiar/sarcastic with Howl (configurable Discord user IDs).
- **AI chat** — `!ask <question>` powered by [Groq](https://console.groq.com) (Vercel AI SDK).
- **Commands** — Prefix commands (e.g. `!ping`, `!say`) and slash commands; loaded from `src/commands` and `src/slashCommands`.
- **Config** — Env-based config: token, prefix, status, Groq key/model, response language, Sophie/Howl IDs.

## Setup

1. **Clone and install**

   ```bash
   bun install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and fill in:

   | Variable | Description |
   |----------|-------------|
   | `TOKEN` | Discord bot token |
   | `PREFIX` | Command prefix (e.g. `!`) |
   | `STATUS` | Bot status text |
   | `GROQ_API_KEY` | [Groq](https://console.groq.com) API key |
   | `GROQ_MODEL` | Model id (e.g. `llama-3.1-8b-instant`) |
   | `AI_LANGUAGE` | Response language (e.g. `Spanish`, `English`) |
   | `SOPHIE_ID` | Discord user ID treated as Sophie |
   | `HOWL_ID` | Discord user ID treated as Howl |

3. **Run**

   ```bash
   bun run start
   ```

## Tech

- [Bun](https://bun.sh) — Runtime
- [discord.js](https://discord.js.org) v14 — Discord API
- [Vercel AI SDK](https://sdk.vercel.ai) + [@ai-sdk/groq](https://www.npmjs.com/package/@ai-sdk/groq) — LLM (Groq)
- TypeScript, ESM

## Project structure

```
src/
├── commands/       # Prefix commands (!ping, !ask, !say, …)
├── slashCommands/  # Slash commands
├── events/         # Discord events (clientReady, messageCreate, interactionCreate)
├── handlers/       # Global handlers (e.g. anticrash)
├── structures/     # Client factory, loaders, utils
└── utils/          # Config (env), helpers
```
