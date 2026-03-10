import { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ChannelType, 
  ChatInputCommandInteraction 
} from 'discord.js';
import type { ICommand } from '@/types/index.js';

export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('configurar')
    .setDescription('Crea automáticamente los roles base y canales de voz.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply();

    // Creación de Roles
    const rolesACrear = ['reventHADAS', 'abandonHADA', 'desquiciHADA', 'traumHADA'];
    for (const nombreRol of rolesACrear) {
      const rolExiste = guild.roles.cache.find(role => role.name === nombreRol);
      if (!rolExiste) {
        await guild.roles.create({ name: nombreRol, color: 'Random' });
      }
    }

    // Creación de Canales de Voz
    const canalesVoz = ['CASUALES COD', 'COMPETITIVO COD', 'VALORANT', 'VALORANT 2'];
    for (const nombreCanal of canalesVoz) {
      const canalExiste = guild.channels.cache.find(
        c => c.name === nombreCanal && c.type === ChannelType.GuildVoice
      );
      if (!canalExiste) {
        await guild.channels.create({
          name: nombreCanal,
          type: ChannelType.GuildVoice,
        });
      }
    }

    await interaction.editReply('✅ Configuración completada: Roles y canales creados correctamente.');
  },
};
