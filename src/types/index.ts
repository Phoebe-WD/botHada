import type { 
  SlashCommandBuilder, 
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ClientEvents
} from 'discord.js';

export interface IBotConfig {
  canalBienvenida?: string;
  mensajeBienvenida?: string;
  imagenBienvenida?: string;
  colorBienvenida?: string;
  [emoji: string]: string | undefined;
}

export interface ICommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void | unknown>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface IEvent<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (...args: ClientEvents[K]) => void | Promise<void>;
}
