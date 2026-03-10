# BotHada

Discord bot for server configuration. Reaction roles, welcome system, and per-server language support.

## Stack

- TypeScript with discord.js v14
- MongoDB with Mongoose 9
- i18n (Spanish / English)

## Requirements

- Node.js v24+
- MongoDB Atlas account (or local MongoDB)
- Discord bot with intents: Guilds, Guild Messages, Message Content, Guild Members, Guild Message Reactions

## Setup

```bash
npm install
cp .env.example .env
# Fill in DISCORD_TOKEN and MONGODB_URI in .env
npm run build
npm start
```

### Development

```bash
npm run dev    # Run with ts-node (no build needed)
```

## Commands

All commands require Administrator permissions.

| Command | Description |
|---------|-------------|
| `!setup` | Create predefined roles and voice channels |
| `!link <emoji> <@role>` | Link an emoji to a role |
| `!unlink <emoji>` | Remove an emoji-role link |
| `!panel` | Generate the reaction role selection panel |
| `!welcome channel <#channel>` | Set the welcome channel |
| `!welcome message <text>` | Set welcome message (`{user}` to mention) |
| `!welcome image <URL>` | Set welcome banner |
| `!welcome color <#HEX>` | Set welcome embed color |
| `!welcome view` | Show current welcome configuration |
| `!welcome test` | Simulate a new member entry |
| `!welcome reset` | Clear all welcome configuration |
| `!language <es/en>` | Change bot language per server |
| `!help` | Show the help panel |

## License

ISC
