import { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ChatInputCommandInteraction,
  ChannelType
} from 'discord.js';
import type { ICommand } from '@/types/index.js';
import { BotClient } from '@/client/BotClient.js';

export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Envía el panel interactivo de roles por reacción.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as BotClient;
    const config = client.configService.getConfig();
    const emojisGuardados = Object.keys(config).filter(key => 
      !['canalBienvenida', 'mensajeBienvenida', 'imagenBienvenida', 'colorBienvenida']
      .includes(key)
    );

    if (emojisGuardados.length === 0) {
      return interaction.reply({ 
        content: '⚠️ No hay roles vinculados. Usa `/vincular` primero.', 
        ephemeral: true 
      });
    }

    let textoPanel = '🎭 **¡Elige tu bando! Reacciona a este mensaje para obtener tu rol:**\n\n';
    for (const emoji of emojisGuardados) {
      const rolId = config[emoji];
      textoPanel += `${emoji} ➔ <@&${rolId}>\n`;
    }

    const channel = interaction.channel;
    if (!channel || channel.partial || channel.type === ChannelType.GroupDM || !('send' in channel)) {
      return interaction.reply({ 
        content: '❌ Este comando solo puede usarse en canales de texto de un servidor.', 
        ephemeral: true 
      });
    }

    const panelMessage = await channel.send(textoPanel);

    await interaction.reply({ content: '✅ Panel enviado correctamente.', ephemeral: true });

    for (const emoji of emojisGuardados) {
      let reaccion = emoji;
      const match = emoji.match(/<a?:.+:(\d+)>/);
      if (match) reaccion = match[1]!;

      await panelMessage.react(reaccion).catch(console.error);
    }
  },
};
