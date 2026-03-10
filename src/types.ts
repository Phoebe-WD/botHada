import { ChatInputCommandInteraction, Client, Message, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export type SlashCommandData = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;

export interface BotCommand {
  name: string;
  aliases?: string[];
  data: SlashCommandData;
  execute(interaction: ChatInputCommandInteraction, client: Client): Promise<unknown>;
  executePrefix(message: Message, args: string[], client: Client): Promise<unknown>;
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
