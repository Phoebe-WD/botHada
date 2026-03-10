# Discord Bot Architecture & Best Practices

This document serves as the high-level technical guide for the project. Our goal is a **production-ready**, **scalable**, and **maintainable** Discord Bot.

## 🧱 Core Layers

### 1. The Client Layer (`src/client/`)

Our custom `BotClient` extends `Discord.Client`. It handles the initialization of the bot, loading of commands, and registration of events.

- **Goal**: Centralized entry point. No business logic here.

### 2. The Command Layer (`src/commands/`)

Every command is an object or class that implements a standard interface:

```typescript
interface ICommand {
  data: SlashCommandBuilder | object;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
```

- **Constraint**: No `any`. Use discord.js types.

### 3. The Event Layer (`src/events/`)

Separate files for each Discord event (e.g., `guildMemberAdd.ts`, `interactionCreate.ts`).

- **Logic**: Events should only call a **Service** or a **Command**. They shouldn't contain complex business logic themselves.

### 4. The Service Layer (`src/services/`)

This is where the heavy lifting happens. Persistence (Database/JSON), validation, and complex calculations.

- **SRP Violation Warning**: If a service handles more than one entity, split it (e.g., `RoleService`, `WelcomeService`).

## 💾 Persistence & Configuration

- We use a validated JSON structure for now, but the **Service Layer** abstracts this to allow migrating to a database (SQL/NoSQL) later without changing the Commands/Events code (**Open/Closed Principle**).

## 🚀 Upgrade Path: discord.js v14

Currently, the Discord API highly prefers **Slash Commands** over prefix commands (`!command`).

- We will use `REST` and `Routes` from `discord.js` to register commands globally or per guild.

## 🛠️ Tooling

- **TypeScript**: Version 5+ for better decorator support and type inference.
- **Node.js**: LTS (v20+ recommended).
- **ESM/CommonJS**: We prioritize ESM for modern compatibility.
