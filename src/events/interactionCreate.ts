import { Events, type Interaction } from 'discord.js';
import type { IEvent } from '@/types/index.js';
import { BotClient } from '@/client/BotClient.js';

export const event: IEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const client = interaction.client as BotClient;
    
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.warn(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: '❌ Hubo un error al ejecutar este comando.', ephemeral: true });
        } else {
          await interaction.reply({ content: '❌ Hubo un error al ejecutar este comando.', ephemeral: true });
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command || !command.autocomplete) return;

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(`Error in autocomplete for ${interaction.commandName}:`, error);
      }
    }
  },
};
