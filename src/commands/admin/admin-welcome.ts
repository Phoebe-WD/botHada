import { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ChatInputCommandInteraction, 
  ChannelType,
  Events
} from 'discord.js';
import type { ICommand } from '@/types/index.js';
import { BotClient } from '@/client/BotClient.js';

export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('admin-welcome')
    .setDescription('Configura el sistema de bienvenidas.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => 
      sub.setName('set-channel')
        .setDescription('Define el canal donde se enviarán las bienvenidas.')
        .addChannelOption(opt => opt.setName('canal').setDescription('El canal de texto').setRequired(true).addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand(sub => 
      sub.setName('set-message')
        .setDescription('Cambia el texto de bienvenida (usa {user} para mencionar).')
        .addStringOption(opt => opt.setName('mensaje').setDescription('El texto del mensaje').setRequired(true))
    )
    .addSubcommand(sub => 
      sub.setName('set-image')
        .setDescription('Define un banner/imagen para el mensaje de bienvenida.')
        .addStringOption(opt => opt.setName('url').setDescription('La URL de la imagen').setRequired(true))
    )
    .addSubcommand(sub => 
      sub.setName('set-color')
        .setDescription('Cambia el color del embed (código HEX).')
        .addStringOption(opt => opt.setName('hex').setDescription('Ejemplo: #ff0000').setRequired(true))
    )
    .addSubcommand(sub => 
      sub.setName('test')
        .setDescription('Simula una entrada para probar la configuración.')
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as BotClient;
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case 'set-channel': {
        const canal = interaction.options.getChannel('canal', true);
        client.configService.updateKey('canalBienvenida', canal.id);
        return interaction.reply(`✅ Las bienvenidas ahora se enviarán en <#${canal.id}>.`);
      }
      case 'set-message': {
        const msg = interaction.options.getString('mensaje', true);
        client.configService.updateKey('mensajeBienvenida', msg);
        return interaction.reply('✅ Mensaje de bienvenida actualizado.');
      }
      case 'set-image': {
        const url = interaction.options.getString('url', true);
        if (!url.startsWith('http')) return interaction.reply({ content: '❌ URL inválida.', ephemeral: true });
        client.configService.updateKey('imagenBienvenida', url);
        return interaction.reply('✅ Banner de bienvenida configurado.');
      }
      case 'set-color': {
        const hex = interaction.options.getString('hex', true);
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!hexRegex.test(hex)) return interaction.reply({ content: '❌ Código HEX inválido.', ephemeral: true });
        client.configService.updateKey('colorBienvenida', hex);
        return interaction.reply(`✅ Color actualizado a **${hex}**.`);
      }
      case 'test': {
        if (!interaction.guild) {
          return interaction.reply({ content: '❌ Este comando solo funciona dentro de un servidor.', ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);
        client.emit(Events.GuildMemberAdd, member);
        return interaction.reply('✅ Simulando entrada de nuevo miembro... Revisa el canal configurado.');
      }
    }
  },
};
