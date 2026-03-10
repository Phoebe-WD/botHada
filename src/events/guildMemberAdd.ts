import { Events, EmbedBuilder, type GuildMember, type ColorResolvable, type GuildTextBasedChannel } from 'discord.js';
import type { IEvent } from '@/types/index.js';
import { BotClient } from '@/client/BotClient.js';

export const event: IEvent<Events.GuildMemberAdd> = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const client = member.client as BotClient;
    const config = client.configService.getConfig();

    if (!config.canalBienvenida) return;

    const canal = member.guild.channels.cache.get(config.canalBienvenida) as GuildTextBasedChannel;
    if (!canal || !canal.isTextBased()) return;

    let textoMensaje = config.mensajeBienvenida || `¡Bienvenido/a al servidor, {user}!`;
    const colorElegido = (config.colorBienvenida as ColorResolvable) || '#ffcc00';

    textoMensaje = textoMensaje.replace(/{user}/g, `<@${member.id}>`);

    const bienvenidaEmbed = new EmbedBuilder()
      .setColor(colorElegido)
      .setTitle('🎉 ¡Un nuevo miembro ha llegado!')
      .setDescription(textoMensaje)
      .setThumbnail(member.user.displayAvatarURL({ forceStatic: false, size: 256 }));

    if (config.imagenBienvenida) {
      bienvenidaEmbed.setImage(config.imagenBienvenida);
    }

    try {
      await canal.send({ 
        content: `¡Hola <@${member.id}>!`, 
        embeds: [bienvenidaEmbed] 
      });
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  },
};
