import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import type { ICommand } from '@/types/index.js';

export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra el panel de ayuda con todos los comandos disponibles.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const ayudaEmbed = new EmbedBuilder()
      .setColor('#00b0f4')
      .setTitle('📚 Panel de Ayuda del Bot')
      .setDescription(
        'Aquí tienes la lista de comandos disponibles. *Nota: La mayoría requiere permisos de Administrador.*'
      )
      .addFields(
        {
          name: '🛠️ Configuración General',
          value: '`/configurar` ➔ Crea automáticamente los roles base y canales.\n`/help` ➔ Muestra este panel de información.',
        },
        {
          name: '🎭 Sistema de Roles por Reacción',
          value: '`/vincular` ➔ Guarda qué emoji dará qué rol.\n`/desvincular` ➔ Borra un emoji de la base de datos.\n`/panel` ➔ Genera el mensaje interactivo para elegir rol.',
        },
        {
          name: '👋 Sistema de Bienvenidas',
          value: '`/setwelcome` ➔ Configura el sistema de saludos.\n`/testwelcome` ➔ Simula una entrada para ver cómo quedó.',
        }
      )
      .setFooter({
        text: 'Cualquier cosa comunicarse con Shica',
        iconURL: interaction.client.user?.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [ayudaEmbed] });
  },
};
