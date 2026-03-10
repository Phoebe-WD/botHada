import { Client, Message } from 'discord.js';

export interface BotCommand {
  name: string;
  aliases?: string[];
  execute(message: Message, args: string[], client: Client): Promise<unknown>;
}

export interface BotEvent {
  name: string;
  execute(...args: unknown[]): Promise<void>;
}

export interface RolesData {
  [emoji: string]: string;
}

export interface WelcomeData {
  channel?: string;
  message?: string;
  image?: string;
  color?: string;
}

export interface GuildSettings {
  language?: string;
}

export interface GuildsData {
  [guildId: string]: GuildSettings;
}

export type SupportedLang = 'es' | 'en';
