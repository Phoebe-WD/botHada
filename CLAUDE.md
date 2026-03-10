# bot-config-dc

Discord bot for server configuration: reaction roles and welcome system.

## Stack

- TypeScript with discord.js v14
- MongoDB with Mongoose (data persistence)
- Environment variables with dotenv (`.env`)
- i18n system with per-guild language support (es/en)

## Structure

```
src/
  index.ts                  → Entry point: connects to DB, loads commands/events, logs in
  types.ts                  → Shared interfaces (BotCommand, BotEvent, data types)
  utils/
    database.ts             → MongoDB connection (connectDB)
    config.ts               → Data access layer (loadRoles, saveRole, loadWelcome, etc.)
    i18n.ts                 → t(guildId, key, vars) async translation function
  models/                   → Mongoose schemas
    RoleBinding.ts          → emoji-to-role mappings per guild
    WelcomeConfig.ts        → welcome settings per guild
    GuildConfig.ts          → guild settings (language)
  commands/                 → One file per command, exports default BotCommand
    setup.ts
    link.ts
    unlink.ts
    panel.ts
    help.ts                 → aliases: ['info']
    welcome.ts              → subcommands: channel, message, image, color, test, view, reset
    language.ts             → aliases: ['lang']
  events/                   → One file per event, exports default BotEvent
    messageReactionAdd.ts
    messageReactionRemove.ts
    guildMemberAdd.ts
locales/                    → Translation files
  es.json                   → Spanish translations
  en.json                   → English translations
dist/                       → Compiled JS output (gitignored)
.env                        → Secrets (do not commit)
.env.example                → Template for .env
```

## Adding a new command

Create a file in `src/commands/` with this structure:

```ts
import { PermissionsBitField } from 'discord.js';
import { t } from '../utils/i18n';
import { BotCommand } from '../types';

const command: BotCommand = {
  name: 'commandname',
  // aliases: ['alias1'],  // optional
  async execute(message, args, client) {
    const gid = message.guild!.id;
    // use await t(gid, 'key') for all user-facing text
  },
};

export default command;
```

The command is registered automatically on bot startup.

## Adding a new event

Create a file in `src/events/` with this structure:

```ts
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'eventName',  // discord.js event name
  async execute(...args: unknown[]) {
    // cast args to their proper types
  },
};

export default event;
```

## Adding a new Mongoose model

Create a file in `src/models/` and add corresponding functions in `src/utils/config.ts`.

## i18n (translations)

All user-facing text must go through the translation system:
- Use `await t(guildId, 'section.key')` for simple strings
- Use `await t(guildId, 'section.key', { var: value })` for interpolation
- `t()` is async (it reads guild language from MongoDB)
- Add new keys to both `locales/es.json` and `locales/en.json`
- Default language is `es` (Spanish)
- Guilds can switch with `!language es/en`

## Bot commands

All require administrator permissions in Discord:

- `!setup` - Create predefined roles and voice channels
- `!link <emoji> <@role>` - Link emoji to role
- `!unlink <emoji>` - Remove emoji-role link
- `!panel` - Generate reaction role selection message
- `!welcome channel <#channel>` - Set welcome channel
- `!welcome message <text>` - Set welcome message ({user} to mention)
- `!welcome image <URL>` - Set welcome banner
- `!welcome color <#HEX>` - Set welcome embed color
- `!welcome view` - Show current welcome configuration
- `!welcome test` - Simulate member entry
- `!welcome reset` - Clear all welcome configuration
- `!help` / `!info` - Help panel
- `!language <es/en>` / `!lang` - Change bot language per server

## Development

```bash
npm install
# Copy .env.example to .env and fill in your values
npm run build     # Compile TypeScript
npm start         # Run compiled JS
npm run dev       # Run with ts-node (development)
```

## Conventions

- Command prefix: `!`
- **All code in English**: file names, function names, variable names, comments, type names
- User-facing text NEVER hardcoded — always use `await t()` from `utils/i18n.ts`
- All translations in `locales/es.json` and `locales/en.json`
- One file per command, one file per event
- Commands with multiple actions use subcommands (e.g., !welcome channel/message/view)
- Data access goes through `utils/config.ts`, never import models directly in commands
- All data functions are async (MongoDB)
- Use TypeScript interfaces from `types.ts` for all exports (BotCommand, BotEvent)
- Export commands and events as `export default`
