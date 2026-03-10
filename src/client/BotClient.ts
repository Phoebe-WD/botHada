import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import type { ICommand } from '@/types/index.js';
import { CommandHandler } from '@/handlers/CommandHandler.js';
import { EventHandler } from '@/handlers/EventHandler.js';
import { ConfigService } from '@/services/ConfigService.js';

export class BotClient extends Client {
  public readonly commands = new Collection<string, ICommand>();
  public readonly configService = new ConfigService();
  private readonly commandHandler = new CommandHandler(this);
  private readonly eventHandler = new EventHandler(this);

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  }

  public async start(token: string): Promise<void> {
    await this.commandHandler.loadCommands();
    await this.eventHandler.loadEvents();
    await this.login(token);
  }
}
