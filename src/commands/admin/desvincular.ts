import { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ChatInputCommandInteraction 
} from 'discord.js';
import type { ICommand } from '@/types/index.js';
import { BotClient } from '@/client/BotClient.js';

export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('desvincular')
    .setDescription('Borra la vinculación de un emoji con un rol.')
    .addStringOption(option => 
      option.setName('emoji')
        .setDescription('El emoji a desvincular')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const emoji = interaction.options.getString('emoji', true);
    const client = interaction.client as BotClient;

    const config = client.configService.getConfig();
    if (!config[emoji]) {
      return interaction.reply({ 
        content: '❌ Ese emoji no está vinculado a ningún rol actualmente.', 
        ephemeral: true 
      });
    }

    client.configService.deleteKey(emoji);

    await interaction.reply(`🗑️ El emoji ${emoji} ha sido desvinculado correctamente.`);
  },
};
