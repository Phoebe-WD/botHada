import { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ChatInputCommandInteraction, 
  Role 
} from 'discord.js';
import type { ICommand } from '@/types/index.js';
import { BotClient } from '@/client/BotClient.js';

export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('vincular')
    .setDescription('Vincula un emoji con un rol para el panel de reacciones.')
    .addStringOption(option => 
      option.setName('emoji')
        .setDescription('El emoji a usar (puede ser normal o personalizado)')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('El rol a asignar')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const emoji = interaction.options.getString('emoji', true);
    const rol = interaction.options.getRole('rol', true) as Role;
    const client = interaction.client as BotClient;

    client.configService.updateKey(emoji, rol.id);

    await interaction.reply(`✅ ¡Listo! He vinculado el emoji ${emoji} con el rol **${rol.name}**.`);
  },
};
