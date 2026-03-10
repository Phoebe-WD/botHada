import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { BotClient } from '@/client/BotClient.js';
import type { IEvent } from '@/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EventHandler {
  constructor(private client: BotClient) {}

  public async loadEvents(): Promise<void> {
    const eventsPath = path.resolve(__dirname, '../events');
    if (!fs.existsSync(eventsPath)) {
      fs.mkdirSync(eventsPath, { recursive: true });
      return;
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const fileUrl = pathToFileURL(filePath).href;
      const { event }: { event: IEvent } = await import(fileUrl);
        
      if (event && event.name) {
        if (event.once) {
          this.client.once(event.name, (...args) => {
            (event.execute as (...args: unknown[]) => void)(...args);
          });
        } else {
          this.client.on(event.name, (...args) => {
            (event.execute as (...args: unknown[]) => void)(...args);
          });
        }
      }
    }
  }
}
