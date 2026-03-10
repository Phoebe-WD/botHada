# BotHada

Discord bot for server configuration. Reaction roles, welcome system, and per-server language support.

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

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

## Contributors ⭐

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Phoebe-WD"><img src="https://avatars.githubusercontent.com/u/68600680?v=4" width="100px;" alt=""/><br /><sub><b>Phoebe Sttefi Wilckens Díaz</b></sub></a><br />💻 📖</td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- DOCS-IGNORE:end -->