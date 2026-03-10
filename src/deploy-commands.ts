import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { BotCommand } from './types';

const commands: unknown[] = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'))
  .filter((f) => (f.endsWith('.js') || f.endsWith('.ts')) && !f.endsWith('.d.ts'));

for (const file of commandFiles) {
  const mod = require(path.join(__dirname, 'commands', file));
  const command: BotCommand = mod.default || mod;
  commands.push(command.data.toJSON());
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error('DISCORD_TOKEN and CLIENT_ID must be defined in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Registering ${commands.length} slash commands...`);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Slash commands registered successfully.');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
    process.exit(1);
  }
})();
