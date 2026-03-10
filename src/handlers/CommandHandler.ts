import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { BotClient } from '@/client/BotClient.js';
import type { ICommand } from '@/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CommandHandler {
  constructor(private client: BotClient) {}

  public async loadCommands(): Promise<void> {
    const commandsPath = path.resolve(__dirname, '../commands');
    if (!fs.existsSync(commandsPath)) {
      fs.mkdirSync(commandsPath, { recursive: true });
      return;
    }

    const categories = fs.readdirSync(commandsPath);

    for (const category of categories) {
      const categoryPath = path.join(commandsPath, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

      for (const file of commandFiles) {
        const filePath = path.join(categoryPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const { command }: { command: ICommand } = await import(fileUrl);
        
        if (command && command.data && command.data.name) {
          this.client.commands.set(command.data.name, command);
        }
      }
    }
  }
}
