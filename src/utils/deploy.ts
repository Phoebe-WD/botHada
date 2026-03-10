import { REST, Routes, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config';
import type { ICommand } from '@/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandsPath = path.resolve(__dirname, '../commands');
const categories = fs.readdirSync(commandsPath);

for (const category of categories) {
  const categoryPath = path.join(commandsPath, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;
  
  const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
  
  for (const file of commandFiles) {
    const filePath = path.join(categoryPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const { command }: { command: ICommand } = await import(fileUrl);
    if (command && command.data) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`⏳ Iniciando la actualización de ${commands.length} comandos de aplicación (/).`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    ) as unknown[];

    console.log(`✅ ¡Éxito! Se registraron ${data.length} comandos de aplicación.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
    process.exit(1);
  }
})();
