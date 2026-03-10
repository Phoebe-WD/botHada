import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { connectDB } from './utils/database';
import { t } from './utils/i18n';
import { BotCommand, BotEvent } from './types';

// ==========================================
// CLIENT INITIALIZATION
// ==========================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ==========================================
// LOAD COMMANDS
// ==========================================
const commands = new Collection<string, BotCommand>();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter((f) => (f.endsWith('.js') || f.endsWith('.ts')) && !f.endsWith('.d.ts'));
for (const file of commandFiles) {
  const mod = require(path.join(__dirname, 'commands', file));
  const command: BotCommand = mod.default || mod;
  commands.set(command.name, command);
  if (command.aliases) {
    for (const alias of command.aliases) {
      commands.set(alias, command);
    }
  }
}

// ==========================================
// LOAD EVENTS
// ==========================================
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter((f) => (f.endsWith('.js') || f.endsWith('.ts')) && !f.endsWith('.d.ts'));
for (const file of eventFiles) {
  const mod = require(path.join(__dirname, 'events', file));
  const event: BotEvent = mod.default || mod;
  client.on(event.name, (...args: unknown[]) => event.execute(...args).catch(console.error));
}

// ==========================================
// MESSAGE HANDLER (COMMANDS)
// ==========================================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command = commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    message.reply(await t(message.guild.id, 'common.error')).catch(console.error);
  }
});

client.once('clientReady', () => {
  console.log(`Bot ${client.user!.tag} is online.`);
  console.log(`Commands loaded: ${commands.size}`);
});

// ==========================================
// START: Connect to DB, then login
// ==========================================
async function start() {
  if (!process.env.DISCORD_TOKEN) {
    throw new Error('DISCORD_TOKEN is not defined in .env');
  }
  await connectDB();
  await client.login(process.env.DISCORD_TOKEN);
}

start().catch((err) => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});
